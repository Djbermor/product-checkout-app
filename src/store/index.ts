import { configureStore } from '@reduxjs/toolkit'
import productReducer from '@store/slices/productSlice'
import transactionReducer from '@store/slices/transactionSlice'

export const store = configureStore({
  reducer: {
    product: productReducer,
    transaction: transactionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
