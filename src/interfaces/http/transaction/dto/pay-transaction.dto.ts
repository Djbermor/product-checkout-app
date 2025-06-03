import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PayTransactionDto {
  @IsNumber()
  amount: number

  @IsEmail()
  customerEmail: string

  @IsString()
  cardHolder: string

  @IsString()
  number: string

  @IsString()
  cvc: string

  @IsString()
  exp_month: string

  @IsString()
  exp_year: string
}
