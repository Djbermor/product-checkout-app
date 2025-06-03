import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateTransactionDto } from '@http/transaction/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '@http/transaction/dto/update-transaction-status.dto';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { WompiService } from '@infra/payment/wompi/wompi.service';
import { Customer } from '@prisma/client';
import { TokenizeRawCardDto } from '@http/transaction/dto/tokenize-card-dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wompiService: WompiService
  ) {}

  async tokenizeCard(dto: TokenizeRawCardDto): Promise<string> {
    return this.wompiService.tokenizeCard({
      number: dto.number,
      cvc: dto.cvc,
      exp_month: dto.exp_month,
      exp_year: dto.exp_year,
      card_holder: dto.card_holder,
    });
  }

  async create(dto: CreateTransactionDto) {
    try {
      
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });

      if (!product) {
        throw new NotFoundException('El producto con ese ID no existe');
      }

      const existingCustomer = await this.prisma.customer.findFirst({
        where: { email: dto.customer.email },
      });

      const customerData = existingCustomer
        ? { connect: { id: existingCustomer.id } }
        : {
            create: {
              name: dto.customer.name,
              phone: dto.customer.phone,
              email: dto.customer.email,
            },
          };

      const transaction = await this.prisma.transaction.create({
        data: {
          status: 'PENDING',
          wompiId: null,
          amount: dto.amount,
          product: { connect: { id: dto.productId } },
          customer: customerData,
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
      });

      const [exp_month, exp_year] = dto.expirationDate.split('/');
      if (!exp_month || !exp_year) {
        throw new InternalServerErrorException('Formato de fecha de expiración inválido');
      }

      const token = await this.wompiService.tokenizeCard({
        number: dto.cardNumber,
        cvc: dto.cvv,
        exp_month,
        exp_year,
        card_holder: dto.cardHolder,
      });

      const wompiResponse = await this.wompiService.payCard({
        amount: transaction.amount,
        customerEmail: transaction.customer.email,
        token,
        reference: `checkout-${transaction.id}`,
        installments: dto.installments,
      });

      const status = wompiResponse.status?.toUpperCase() || 'DECLINED';
      console.log('✅ Estado antes deactauizar:', status);
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status,
          wompiId: wompiResponse.id,
        },
        include: {
          product: true,
          customer: true,
          delivery: true,
        },
      });

      if (status === 'APPROVED') {
        await this.prisma.product.update({
          where: { id: transaction.productId },
          data: {
            stock: { decrement: 1 },
          },
        });
      }

      return updatedTransaction;

    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('❌ Error al crear transacción:', error);
      throw new InternalServerErrorException('Error al procesar el pago con Wompi');
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