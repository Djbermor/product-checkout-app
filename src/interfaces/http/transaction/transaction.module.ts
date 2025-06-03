import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '@app/transaction/services/transaction.service';
import { WompiService } from '@infra/payment/wompi/wompi.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, WompiService]
})
export class TransactionModule {}
