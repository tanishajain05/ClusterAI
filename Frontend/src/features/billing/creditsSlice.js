import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { billingService } from '@services/billingService'

export const fetchWallet = createAsyncThunk('credits/fetchWallet', async () => {
  return await billingService.getWallet()
})

export const deductCredits = createAsyncThunk(
  'credits/deduct',
  async ({ amount, reason, agentType }) => {
    return await billingService.deductCredits({ amount, reason, agentType })
  }
)

export const addCredits = createAsyncThunk(
  'credits/add',
  async ({ amount, reason }) => {
    return await billingService.addCredits({ amount, reason })
  }
)

const creditsSlice = createSlice({
  name: 'credits',
  initialState: {
    balance: 0,
    usedThisPeriod: 0,
    status: 'idle',
    lowBalanceThreshold: 20,
  },
  reducers: {
    setBalance(state, { payload }) { state.balance = payload },
    optimisticDeduct(state, { payload }) {
      state.balance = Math.max(0, state.balance - payload)
      state.usedThisPeriod += payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.fulfilled, (state, { payload }) => {
        state.balance = payload.balance
        state.usedThisPeriod = payload.usedThisPeriod || 0
        state.status = 'succeeded'
      })
      .addCase(deductCredits.fulfilled, (state, { payload }) => {
        state.balance = payload.balance
        state.usedThisPeriod = payload.usedThisPeriod
      })
      .addCase(addCredits.fulfilled, (state, { payload }) => {
        state.balance = payload.balance
      })
  },
})

export const { setBalance, optimisticDeduct } = creditsSlice.actions
export default creditsSlice.reducer
