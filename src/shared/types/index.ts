// src/shared/types/index.ts

// 👉 Para crear una transacción desde el frontend
export interface CreateTransactionDto {
  productId: string
  amount: number
  customer: {
    name: string
    phone: string
    email: string
  }
  delivery: {
    address: string
  }
}

// 👉 Lo que el backend retorna al crear una transacción
export interface Transaction {
  id: string
  amount: number
  status: string
  wompiId?: string
  createdAt: string
  product: Product
  customer: Customer
  delivery: Delivery
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
}

export interface Delivery {
  id: string
  address: string
  transactionId: string
}