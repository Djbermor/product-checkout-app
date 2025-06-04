import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from './productSlice'

interface DeliveryInfo {
  name: string
  address: string
  phone: string
}

interface TransactionState {
  product?: Product
  delivery?: DeliveryInfo
  cardNumber?: string
  status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILURE'
}

const initialState: TransactionState = {
  status: 'IDLE',
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<Product>) {
      state.product = action.payload
    },
    setDelivery(state, action: PayloadAction<DeliveryInfo>) {
      state.delivery = action.payload
    },
    setCardNumber(state, action: PayloadAction<string>) {
      state.cardNumber = action.payload
    },
    setStatus(state, action: PayloadAction<TransactionState['status']>) {
      state.status = action.payload
    },
    resetTransaction() {
      return initialState
    },
    updateTransactionStatus(state, action: PayloadAction<TransactionState['status']>) {
      state.status = action.payload
    },
  },
})


export const { setProduct, setDelivery, setCardNumber, setStatus, resetTransaction } = transactionSlice.actions
export default transactionSlice.reducer
export type TransactionStatus =
  | 'IDLE'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'APPROVED'
  | 'DECLINED'
  | 'ERROR'
  | null

