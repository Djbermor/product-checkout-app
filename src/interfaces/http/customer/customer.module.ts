import { Module } from '@nestjs/common'
import { CustomerController } from './customer.controller'
import { CustomerService } from '@app/customer/services/customer.service';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService],
})
export class CustomerModule {}
