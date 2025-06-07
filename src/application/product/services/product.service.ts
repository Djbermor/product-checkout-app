import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { CreateProductDto } from '@http/product/dto/create-product.dto';
import { randomUUID } from 'crypto'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        id: randomUUID(),
        ...dto
      }
    })
  }

  async findAll() {
    return this.prisma.product.findMany()
  }
}
