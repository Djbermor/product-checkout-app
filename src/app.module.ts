import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { ProductModule } from '@http/product/product.module';
import { TransactionModule } from '@http/transaction/transaction.module';
import { CustomerModule } from '@http/customer/customer.module';

@Module({
  imports: [PrismaModule, ProductModule, TransactionModule, CustomerModule, ConfigModule.forRoot({
      isGlobal: true,})],
})
export class AppModule {}
