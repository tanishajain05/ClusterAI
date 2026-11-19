import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@services/authService'

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.googleLogin()
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    return await authService.getSession()
  } catch {
    return rejectWithValue(null)
  }
})

const initialState = {
  user: null,          // { uid, name, email, photoURL, role }
  status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  firstLogin: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) { state.error = null },
    setRole(state, { payload }) {
      if (state.user) state.user.role = payload
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading'; state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.user = payload.user
        state.firstLogin = payload.firstLogin || false
      })
      .addCase(loginWithGoogle.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; state.status = 'idle'; state.firstLogin = false
      })
      // restore session
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.user = payload; state.status = 'succeeded'
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null; state.status = 'idle'
      })
  },
})

export const { clearError, setRole } = authSlice.actions
export default authSlice.reducer
