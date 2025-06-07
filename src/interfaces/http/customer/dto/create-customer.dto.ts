import { IsString, IsEmail, MinLength } from 'class-validator'

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  name: string

  @IsString()
  @MinLength(7)
  phone: string

  @IsEmail()
  email: string
}
