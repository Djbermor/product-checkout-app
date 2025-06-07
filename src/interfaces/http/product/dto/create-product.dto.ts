import { IsString, IsNumber, IsPositive } from 'class-validator'

export class CreateProductDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  @IsPositive()
  price: number

  @IsNumber()
  @IsPositive()
  stock: number
}
