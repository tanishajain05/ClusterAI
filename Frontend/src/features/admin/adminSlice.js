import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminService } from '@services/adminService'

export const fetchMetrics = createAsyncThunk('admin/fetchMetrics', async () => {
  return await adminService.getMetrics()
})

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  return await adminService.getUsers()
})

export const fetchAuditLog = createAsyncThunk('admin/fetchAuditLog', async () => {
  return await adminService.getAuditLog()
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    metrics: null,
    users: [],
    auditLog: [],
    status: 'idle',
    userSearch: '',
  },
  reducers: {
    setUserSearch(state, { payload }) { state.userSearch = payload },
    updateUser(state, { payload }) {
      const idx = state.users.findIndex((u) => u.uid === payload.uid)
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.fulfilled, (state, { payload }) => { state.metrics = payload })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => { state.users = payload })
      .addCase(fetchAuditLog.fulfilled, (state, { payload }) => { state.auditLog = payload })
  },
})

export const { setUserSearch, updateUser } = adminSlice.actions
export default adminSlice.reducer
