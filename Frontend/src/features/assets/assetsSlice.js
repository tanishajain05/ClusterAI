import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { agentService } from '@services/agentService'

export const fetchAssets = createAsyncThunk('assets/fetch', async () => {
  return await agentService.getAssets()
})

const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    list: [],     // [{ id, name, type, url, size, createdAt, creditsUsed, agentType }]
    status: 'idle',
    filter: 'all',   // 'all' | 'pdf' | 'ppt' | 'image' | 'code'
    searchQuery: '',
  },
  reducers: {
    addAsset(state, { payload }) {
      state.list.unshift(payload)
    },
    deleteAsset(state, { payload }) {
      state.list = state.list.filter((a) => a.id !== payload)
    },
    setFilter(state, { payload }) { state.filter = payload },
    setSearch(state, { payload }) { state.searchQuery = payload },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.fulfilled, (state, { payload }) => {
      state.list = payload; state.status = 'succeeded'
    })
  },
})

export const { addAsset, deleteAsset, setFilter, setSearch } = assetsSlice.actions
export default assetsSlice.reducer
