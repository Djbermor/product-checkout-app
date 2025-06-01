import { Injectable } from "@nestjs/common"
import { CreateTransactionDto } from "./dto/create-transaction.dto"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateTransactionDto) {
        return this.prisma.transaction.create({
            data: {
                productId: dto.productId,
                customerId: dto.customerId,
                deliveryId: dto.deliveryId,
                amount: dto.amount,
                status: 'PENDING',
                wompiId: dto.wompiId 
            },
        })
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
}