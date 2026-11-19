import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { agentService } from '@services/agentService'
import { uid } from '@utils/format'

export const fetchConversations = createAsyncThunk('conversations/fetch', async () => {
  return await agentService.getConversations()
})

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    list: [],           // [{ id, title, agentType, messages[], pinned, createdAt, updatedAt }]
    activeId: null,
    status: 'idle',
    searchQuery: '',
  },
  reducers: {
    createConversation(state, { payload }) {
      const conv = {
        id: uid(),
        title: payload.title || 'New conversation',
        agentType: payload.agentType || 'chat',
        messages: [],
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...payload,
      }
      state.list.unshift(conv)
      state.activeId = conv.id
    },
    setActiveConversation(state, { payload }) {
      state.activeId = payload
    },
    addMessage(state, { payload }) {
      const conv = state.list.find((c) => c.id === payload.convId)
      if (!conv) return
      conv.messages.push({ id: uid(), createdAt: new Date().toISOString(), ...payload.message })
      conv.updatedAt = new Date().toISOString()
      if (conv.messages.length === 1 && payload.message.role === 'user') {
        conv.title = payload.message.content.slice(0, 50)
      }
    },
    updateMessageContent(state, { payload }) {
      // used for streaming: append token to last assistant message
      const conv = state.list.find((c) => c.id === payload.convId)
      if (!conv) return
      const msg = conv.messages.find((m) => m.id === payload.messageId)
      if (msg) msg.content = payload.content
    },
    setMessageStatus(state, { payload }) {
      const conv = state.list.find((c) => c.id === payload.convId)
      if (!conv) return
      const msg = conv.messages.find((m) => m.id === payload.messageId)
      if (msg) msg.status = payload.status
    },
    renameConversation(state, { payload }) {
      const conv = state.list.find((c) => c.id === payload.id)
      if (conv) conv.title = payload.title
    },
    pinConversation(state, { payload }) {
      const conv = state.list.find((c) => c.id === payload)
      if (conv) conv.pinned = !conv.pinned
    },
    deleteConversation(state, { payload }) {
      state.list = state.list.filter((c) => c.id !== payload)
      if (state.activeId === payload) state.activeId = state.list[0]?.id || null
    },
    setSearchQuery(state, { payload }) {
      state.searchQuery = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversations.fulfilled, (state, { payload }) => {
      state.list = payload; state.status = 'succeeded'
    })
  },
})

export const {
  createConversation, setActiveConversation, addMessage,
  updateMessageContent, setMessageStatus, renameConversation,
  pinConversation, deleteConversation, setSearchQuery,
} = conversationsSlice.actions

export default conversationsSlice.reducer
