import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { WompiService } from '../wompi/wompi.service'

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wompiService: WompiService
  ) {}

  async create(dto: CreateTransactionDto) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      })

      if (!product) {
        throw new NotFoundException('El producto con ese ID no existe')
      }

      // 1. Crear transacción en estado PENDING
      const transaction = await this.prisma.transaction.create({
        data: {
          status: 'PENDING',
          wompiId: null,
          amount: dto.amount,
          product: {
            connect: { id: dto.productId },
          },
          customer: {
            create: {
              name: dto.customer.name,
              phone: dto.customer.phone,
              email: dto.customer.email,
            },
          },
          delivery: {
            create: {
              address: dto.delivery.address,
            },
          },
        },
        include: {
          product: true,
          customer: true,
          delivery: true,
        },
      })

      // 2. Consumir API de Wompi
      const wompiResponse = await this.wompiService.payCard({
        amount: transaction.amount,
        customerEmail: transaction.customer.email,
      })

      const wompiId = wompiResponse.id
      const status = wompiResponse.status.toUpperCase()

      // 3. Actualizar estado y wompiId
      const updated = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status,
          wompiId,
        },
        include: {
          product: true,
          customer: true,
          delivery: true,
        },
      })

      // 4. Si fue aprobado, descontar stock
      if (status === 'APPROVED') {
        await this.prisma.product.update({
          where: { id: transaction.productId },
          data: {
            stock: { decrement: 1 },
          },
        })
      }

      return updated
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(
        'Error al procesar el pago con Wompi'
      )
    }
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        product: true,
        customer: true,
        delivery: true,
      },
    })
  }
  
  async findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
        delivery: true
      }
    })
  }

  async updateStatus(dto: UpdateTransactionStatusDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: dto.id },
    })

    if (!transaction) {
      throw new NotFoundException('La transacción no existe')
    }

    const updated = await this.prisma.transaction.update({
      where: { id: dto.id },
      data: {
        status: dto.status,
        wompiId: dto.wompiId ?? transaction.wompiId,
      },
    })

    if (dto.status === 'APPROVED') {
      await this.prisma.product.update({
        where: { id: transaction.productId },
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