import { CreateTransactionDto } from '@shared/types'
import { createTransactionRequest } from '@infra/api/wompiApi'

export async function createTransaction(data: CreateTransactionDto) {
  const res = await createTransactionRequest(data)
  return res.data
}
