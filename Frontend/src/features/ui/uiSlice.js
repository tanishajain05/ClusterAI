import { createSlice } from '@reduxjs/toolkit'
import { uid } from '@utils/format'

// Persist theme preference in localStorage (non-sensitive UI preference)
const savedTheme = localStorage.getItem('theme') || 'dark'
if (savedTheme === 'dark') document.documentElement.classList.add('dark')

const initialState = {
  theme: savedTheme,          // 'light' | 'dark'
  sidebarOpen: true,          // desktop sidebar collapsed state
  mobileSidebarOpen: false,   // mobile drawer
  toasts: [],                 // { id, type, message, duration }
  activeAgent: 'chat',        // 'chat' | 'coding' | 'search' | 'docmedia'
  rightPanelOpen: true,       // collapsible right preview panel
  modal: null,                // { type, props } or null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme)
      document.documentElement.classList.toggle('dark', state.theme === 'dark')
    },
    setTheme(state, { payload }) {
      state.theme = payload
      localStorage.setItem('theme', payload)
      document.documentElement.classList.toggle('dark', payload === 'dark')
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setMobileSidebar(state, { payload }) {
      state.mobileSidebarOpen = payload
    },
    setActiveAgent(state, { payload }) {
      state.activeAgent = payload
    },
    toggleRightPanel(state) {
      state.rightPanelOpen = !state.rightPanelOpen
    },
    addToast(state, { payload }) {
      state.toasts.push({ id: uid(), duration: 4000, ...payload })
    },
    removeToast(state, { payload }) {
      state.toasts = state.toasts.filter((t) => t.id !== payload)
    },
    openModal(state, { payload }) {
      state.modal = payload  // { type, props }
    },
    closeModal(state) {
      state.modal = null
    },
  },
})

export const {
  toggleTheme, setTheme, toggleSidebar, setMobileSidebar,
  setActiveAgent, toggleRightPanel,
  addToast, removeToast, openModal, closeModal,
} = uiSlice.actions

export default uiSlice.reducer
