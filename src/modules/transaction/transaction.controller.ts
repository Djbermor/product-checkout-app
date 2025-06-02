import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  Get,
  NotFoundException,
  ParseUUIDPipe
} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto)
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll()
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: Omit<UpdateTransactionStatusDto, 'id'>
  ) {
    return this.transactionService.updateStatus({ id, ...body })
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const transaction = await this.transactionService.findOne(id)
    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada')
    }
    return transaction
  }
}