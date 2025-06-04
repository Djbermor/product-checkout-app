import { Product } from '@domain/product/entities/Product'
import { getProducts } from '@infra/api/wompiApi'

export async function fetchProducts(): Promise<Product[]> {
  const response = await getProducts()
  return response.data
}