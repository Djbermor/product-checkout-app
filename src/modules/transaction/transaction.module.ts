import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { WompiService } from '../wompi/wompi.service'

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, WompiService]
})
export class TransactionModule {}
