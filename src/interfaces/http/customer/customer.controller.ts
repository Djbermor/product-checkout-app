import { Controller, Post, Get, Body } from '@nestjs/common'
import { CustomerService } from '@app/customer/services/customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto'

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto)
  }

  @Get()
  async findAll() {
    return this.customerService.findAll()
  }
}