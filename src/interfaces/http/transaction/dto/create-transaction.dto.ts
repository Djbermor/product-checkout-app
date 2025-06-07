import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsCreditCard,
  IsEmail,
  MinLength,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
} from 'class-validator'
import { Type } from 'class-transformer'

class CustomerDto {
  @IsString()
  @MinLength(2)
  name: string

  @IsString()
  @MinLength(7)
  phone: string

  @IsEmail()
  email: string
}

class DeliveryDto {
  @IsString()
  @IsNotEmpty()
  address: string
}

export class CreateTransactionDto {
  @IsUUID()
  productId: string

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto

  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto

  @IsNumber()
  @IsPositive()
  amount: number

  @IsCreditCard()
  cardNumber: string

  @IsString()
  @MinLength(3)
  cardHolder: string

  @IsString()
  @MinLength(5)
  expirationDate: string

  @IsString()
  @MinLength(3)
  cvv: string

  @IsInt()
  @Min(1)
  @Max(36)
  installments: number
}
