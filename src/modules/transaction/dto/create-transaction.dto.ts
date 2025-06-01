export class CreateTransactionDto {
  customer: {
    productId: number
    customerId: number
    deliveryId: number
    amount: number
    wompiId?: string
  }
  delivery: {
    address: string
  }
  productId: string
  cardNumber: string
}