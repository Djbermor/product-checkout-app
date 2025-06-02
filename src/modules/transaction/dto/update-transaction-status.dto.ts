import { IsUUID, IsString, IsIn, IsOptional } from 'class-validator'

export class UpdateTransactionStatusDto {
  @IsUUID()
  id: string

  @IsString()
  @IsIn(['APPROVED', 'DECLINED', 'ERROR'])
  status: string

  @IsString()
  @IsOptional()
  wompiId?: string
}