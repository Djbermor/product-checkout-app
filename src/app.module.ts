import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { ProductModule } from './modules/product/product.module'
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [PrismaModule, ProductModule, TransactionModule],
})
export class AppModule {}
