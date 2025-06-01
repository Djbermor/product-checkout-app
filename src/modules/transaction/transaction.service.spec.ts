import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { randomUUID } from 'crypto'

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const { customer, delivery, productId, cardNumber } = data

    // Guardar cliente (o buscar por email si ya existe)
    const existing = await this.prisma.customer.findFirst({ where: { email: customer.email } })
    const customerRecord = existing || await this.prisma.customer.create({ data: customer })

    // Crear transacción en estado PENDING
    const transaction = await this.prisma.transaction.create({
      data: {
        status: 'PENDING',
        productId,
        customerId: customerRecord.id,
      },
    })

    // Guardar dirección
    await this.prisma.delivery.create({
      data: {
        address: delivery.address,
        transactionId: transaction.id,
      },
    })

    // Simular llamada a Wompi y actualizar resultado
    const paymentSuccess = cardNumber.startsWith('4') // Simulación (Visa = 4)

    const updated = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: paymentSuccess ? 'SUCCESS' : 'FAILURE',
        wompiId: randomUUID(), // ID simulado
      },
    })

    // Si éxito, disminuir stock
    if (paymentSuccess) {
      await this.prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      })
    }

    return updated
  }
}