import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { billingService } from '@services/billingService'
import { uid } from '@utils/format'

export const fetchTransactions = createAsyncThunk('transactions/fetch', async () => {
  return await billingService.getTransactions()
})

export const createOrder = createAsyncThunk('transactions/createOrder', async (packId) => {
  return await billingService.createOrder(packId)
})

export const verifyPayment = createAsyncThunk('transactions/verifyPayment', async (payload) => {
  return await billingService.verifyPayment(payload)
})

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    status: 'idle',
    pendingOrder: null,
  },
  reducers: {
    addTransaction(state, { payload }) {
      state.list.unshift({ id: uid(), createdAt: new Date().toISOString(), ...payload })
    },
    setPendingOrder(state, { payload }) {
      state.pendingOrder = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.list = payload; state.status = 'succeeded'
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.pendingOrder = payload
      })
      .addCase(verifyPayment.fulfilled, (state, { payload }) => {
        state.list.unshift(payload.transaction)
        state.pendingOrder = null
      })
  },
})

export const { addTransaction, setPendingOrder } = transactionsSlice.actions
export default transactionsSlice.reducer
