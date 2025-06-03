import { Injectable, HttpException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { sign } from 'crypto';

@Injectable()
export class WompiService {
  private readonly wompiBaseUrl = process.env.UAT_SANDBOX_URL
  private readonly privateKey = process.env.PRV_STAGTEST
  private readonly publicteKey = process.env.PUB_STAGTEST
  private readonly integrityKey = process.env.STAGTEST_INTEGRITY;

  constructor() {
    if (!this.wompiBaseUrl || !this.privateKey || !this.publicteKey) {
      throw new Error('WOMPI configuration is incomplete. Check your .env file.');
    }
  }

  async tokenizeCard(card: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    try {
      const response = await axios.post(
        `${this.wompiBaseUrl}/tokens/cards`,
        card,
        {
          headers: {
            Authorization: `Bearer ${this.publicteKey}`,
          },
        }
      );

      const token = response.data?.data?.id;

      if (!token) {
        console.error('No se recibió token desde Wompi:', response.data);
        throw new InternalServerErrorException('Token inválido recibido de Wompi');
      }

      return token;
    } catch (error) {
      console.error('❌ Error al tokenizar tarjeta:', error.response?.data || error.message);
      throw new HttpException('Error al tokenizar tarjeta', 500);
    }
  }

  async payCard(transactionData: {
    amount: number;
    customerEmail: string;
    token: string;
    reference: string;
    installments?: number;
  }) {
    try {
      if (!transactionData.token || !transactionData.token.startsWith('tok_stagtest_')) {
        console.error('🚫 Token inválido o ausente:', transactionData.token);
        throw new BadRequestException('Token inválido o ausente');
      }
      if (!this.integrityKey) {
        console.error('❌ WOMPI_INTEGRITY_SECRET no definido en el archivo .env');
        throw new InternalServerErrorException('WOMPI_INTEGRITY_SECRET no definido');
      }
      const data_signature = {
        "reference": transactionData.reference,
        "amount_in_cents": transactionData.amount * 100,
        "currency": "COP",
        "integrity_key": this.integrityKey
      };

      const accessToken = this.generarFirmaWompi(data_signature);

      const tokenAccess = await this.getTokenAccess();
      if (!tokenAccess) { 
        throw new InternalServerErrorException('No se pudo obtener el token de acceso de Wompi');
      }

      const payload = {
        amount_in_cents: transactionData.amount * 100,
        currency: "COP",
        customer_email: transactionData.customerEmail,
        payment_method: {
          type: "CARD",
          token: transactionData.token,
          installments: transactionData.installments || 1,
        },
        reference: transactionData.reference,
        signature: accessToken,
        acceptance_token: tokenAccess,
      };
      
      console.log('🔍 Token recibido para pago:', transactionData.token);

      console.log('➡️ Enviando transacción a Wompi:', payload);
      console.log('🔒 Payload final a /transactions:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${this.wompiBaseUrl}/transactions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        }
      );

      await new Promise(resolve => setTimeout(resolve, 5000)); // espera 3 segundos

      const transactionId = response.data?.data?.id;
      console.log('✅ ID:', transactionId);

      const finalStatusRes = await axios.get(`${this.wompiBaseUrl}/transactions/${transactionId}`);

      console.log('✅ Transacción procesada con éxito:', finalStatusRes.data);

      const { id, status, reference } = finalStatusRes.data?.data;


      return { id, status, reference };
    } catch (error) {
      console.error('❌ Error al pagar con tarjeta:', error.response?.data || error.message);
      throw new HttpException('Error al contactar Wompi', 500);
    }
  }

  async getTokenAccess(): Promise<string> {
    try {
      const response = await axios.get(`${this.wompiBaseUrl}/merchants/${this.publicteKey}`);
      const token = response.data?.data?.presigned_acceptance?.acceptance_token;
      if (!token) {
        console.error('No se recibió token de acceso desde Wompi:', response.data);
        throw new InternalServerErrorException('Token de acceso inválido recibido de Wompi');
      }
      return token;
    } catch (error) {
      console.error('❌ Error al obtener token de acceso:', error.response?.data || error.message);
      throw new HttpException('Error al obtener token de acceso', 500);
    }
  }

  generarFirmaWompi(data_signature: { reference: string; amount_in_cents: number; currency: string; integrity_key: string }): string {
    const { reference, amount_in_cents, currency, integrity_key } = data_signature;

    if (!integrity_key) {
      throw new Error('❌ WOMPI_INTEGRITY_SECRET no definido en el archivo .env');
    }

    const stringToSign = `${reference}${amount_in_cents}${currency}${integrity_key}`;

    const signature = require('crypto').createHash('sha256').update(stringToSign).digest('hex');

    return signature;
  }
  
}
