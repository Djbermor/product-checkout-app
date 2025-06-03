import { Controller, Post, Get, Body } from '@nestjs/common'
import { ProductService } from '@app/product/services/product.service';
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto)
  }

  @Get()
  async findAll() {
    return this.productService.findAll()
  }
}