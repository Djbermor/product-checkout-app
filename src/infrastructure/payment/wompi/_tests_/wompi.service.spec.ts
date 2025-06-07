import {
  Injectable,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';

@Injectable()
export class WompiService {
  private readonly wompiBaseUrl = process.env.UAT_SANDBOX_URL;
  private readonly privateKey = process.env.PRV_STAGTEST;
  private readonly publicKey = process.env.PUB_STAGTEST;
  private readonly integrityKey = process.env.STAGTEST_INTEGRITY;

  constructor() {
    if (!this.wompiBaseUrl || !this.privateKey || !this.publicKey || !this.integrityKey) {
      throw new Error('❌ WOMPI config incomplete. Revisa el archivo .env');
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
            Authorization: `Bearer ${this.publicKey}`,
          },
        }
      );

      const token = response.data?.data?.id;

      if (!token) {
        console.error('⚠️ Token no recibido desde Wompi:', response.data);
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
  }): Promise<{ id: string; status: string; reference: string }> {
    try {
      if (!transactionData.token?.startsWith('tok_stagtest_')) {
        console.error('🚫 Token inválido o ausente:', transactionData.token);
        throw new BadRequestException('Token inválido o ausente');
      }

      const signature = this.generarFirmaWompi({
        reference: transactionData.reference,
        amount_in_cents: transactionData.amount * 100,
        currency: 'COP',
        integrity_key: this.integrityKey!,
      });

      const acceptance_token = await this.getTokenAccess();

      const payload = {
        amount_in_cents: transactionData.amount * 100,
        currency: 'COP',
        customer_email: transactionData.customerEmail,
        payment_method: {
          type: 'CARD',
          token: transactionData.token,
          installments: transactionData.installments || 1,
        },
        reference: transactionData.reference,
        signature,
        acceptance_token,
      };

      console.log('➡️ Enviando transacción a Wompi:', payload);

      const response = await axios.post(`${this.wompiBaseUrl}/transactions`, payload, {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
        },
      });

      const transactionId = response.data?.data?.id;

      if (!transactionId) {
        throw new InternalServerErrorException('ID de transacción no recibido');
      }

      await this.delay(5000); 

      const finalStatusRes = await axios.get(
        `${this.wompiBaseUrl}/transactions/${transactionId}`
      );

      const { id, status, reference } = finalStatusRes.data?.data;
      console.log('✅ Transacción finalizada:', { id, status, reference });

      return { id, status, reference };
    } catch (error) {
      console.error('❌ Error al pagar con tarjeta:', error.response?.data || error.message);
      throw new HttpException('Error al contactar Wompi', 500);
    }
  }

  async getTokenAccess(): Promise<string> {
    try {
      const response = await axios.get(`${this.wompiBaseUrl}/merchants/${this.publicKey}`);
      const token = response.data?.data?.presigned_acceptance?.acceptance_token;

      if (!token) {
        console.error('⚠️ Token de aceptación no recibido:', response.data);
        throw new InternalServerErrorException('Token de aceptación inválido');
      }

      return token;
    } catch (error) {
      console.error('❌ Error al obtener token de acceso:', error.response?.data || error.message);
      throw new HttpException('Error al obtener token de acceso', 500);
    }
  }

  generarFirmaWompi(data_signature: {
    reference: string;
    amount_in_cents: number;
    currency: string;
    integrity_key: string;
  }): string {
    const { reference, amount_in_cents, currency, integrity_key } = data_signature;

    const stringToSign = `${reference}${amount_in_cents}${currency}${integrity_key}`;
    return createHash('sha256').update(stringToSign).digest('hex');
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
