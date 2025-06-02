import { Injectable, HttpException } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class WompiService {
  async payCard(transactionData: {
    amount: number
    customerEmail: string
  }) {
    try {
      const response = await axios.post(
        'https://sandbox.wompi.co/v1/transactions',
        {
          amount_in_cents: transactionData.amount * 100,
          currency: 'COP',
          customer_email: transactionData.customerEmail,
          payment_method: {
            type: 'CARD',
            token: 'tok_test_visa_4242' // Token fijo de sandbox
          },
          reference: `checkout-${Date.now()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
          },
        }
      )

      return {
        id: response.data.data.id,
        status: response.data.data.status,
        reference: response.data.data.reference,
      }
    } catch (error) {
      console.error(error.response?.data || error)
      throw new HttpException('Error al contactar Wompi', 500)
    }
  }
}