import { createSlice } from '@reduxjs/toolkit'

type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

interface ProductState {
  products: Product[]
}

const initialState: ProductState = {
  products: [
    {
      id: '1',
      name: 'Awesome Shirt',
      description: 'A very nice shirt.',
      price: 49.99,
      stock: 5,
    },
  ],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    decrementStock(state, action) {
      const product = state.products.find(p => p.id === action.payload)
      if (product && product.stock > 0) {
        product.stock--
      }
    },
  },
})

export const { decrementStock } = productSlice.actions
export default productSlice.reducer
export type { Product }