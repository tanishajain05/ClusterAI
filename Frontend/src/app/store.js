import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'
import uiReducer from '@features/ui/uiSlice'
import creditsReducer from '@features/billing/creditsSlice'
import conversationsReducer from '@features/chat/conversationsSlice'
import assetsReducer from '@features/assets/assetsSlice'
import transactionsReducer from '@features/billing/transactionsSlice'
import adminReducer from '@features/admin/adminSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    credits: creditsReducer,
    conversations: conversationsReducer,
    assets: assetsReducer,
    transactions: transactionsReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export default store
