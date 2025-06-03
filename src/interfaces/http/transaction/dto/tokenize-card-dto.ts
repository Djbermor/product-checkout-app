import { IsCreditCard, IsString, Length, Matches } from 'class-validator';

export class TokenizeRawCardDto {
  @IsCreditCard()
  number: string;

  @IsString()
  @Length(3, 4)
  cvc: string;

  @IsString()
  @Matches(/^\d{2}$/, { message: 'exp_month must be 2 digits' })
  exp_month: string;

  @IsString()
  @Matches(/^\d{2}$/, { message: 'exp_year must be 2 digits' })
  exp_year: string;

  @IsString()
  @Length(3)
  card_holder: string;
}
