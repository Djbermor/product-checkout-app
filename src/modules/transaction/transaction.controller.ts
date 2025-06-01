import { Controller, Post, Body, Get } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    const result = await this.transactionService.create(dto)
    return {
        id: 'some-id',
        status: 'some-status',
        wompiId: 'some-wompi-id',
    }
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll()
  }    // Aquí podrías agregar más endpoints según sea necesario
}