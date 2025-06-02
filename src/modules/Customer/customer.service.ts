import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { randomUUID } from 'crypto'

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        id: randomUUID(),
        ...dto
      }
    })
  }

  async findAll() {
    return this.prisma.customer.findMany()
  }
}