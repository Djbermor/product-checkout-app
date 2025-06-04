import axios from 'axios'
import { Product } from '@domain/product/entities/Product'
import { CreateTransactionDto, Transaction } from '@shared/types'

const API_URL = process.env.VITE_API_URL || 'http://localhost:4000'

export function getProducts() {
  return axios.get<Product[]>(`${API_URL}/products`)
}

export function createTransactionRequest(data: CreateTransactionDto) {
  return axios.post<Transaction>(`${API_URL}/transactions`, data)
}

export const getTransactionStatus = async (transactionId: string) => {
  const response = await axios.get(`https://sandbox.wompi.co/v1/transactions/${transactionId}`)
  return response.data.data
}
