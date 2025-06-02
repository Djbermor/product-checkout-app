import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module'
import { ProductModule } from './modules/product/product.module'
import { TransactionModule } from './modules/transaction/transaction.module';
import { CustomerModule } from './modules/Customer/customer.module';

@Module({
  imports: [PrismaModule, ProductModule, TransactionModule, CustomerModule, ConfigModule.forRoot({
      isGlobal: true,})],
})
export class AppModule {}
