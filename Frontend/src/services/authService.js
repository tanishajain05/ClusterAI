/**
 * authService — mirrors POST /auth/session, DELETE /auth/session
 * Set VITE_USE_MOCK=true to bypass Firebase entirely.
 */
import { sleep } from '@utils/format'
import { MOCK_USER } from './mock/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Session key (non-sensitive preference only — no tokens stored)
const SESSION_KEY = 'clusterai_session'

export const authService = {
  /** POST /auth/session — Google OAuth login */
  async googleLogin() {
    if (USE_MOCK) {
      await sleep(800)
      const existing = sessionStorage.getItem(SESSION_KEY)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USER))
      return { user: MOCK_USER, firstLogin: !existing }
    }

    // TODO: replace with real Firebase Google popup + backend session
    const { signInWithPopup } = await import('firebase/auth')
    const { auth, googleProvider } = await import('/utils/firebase')
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    const { default: api } = await import('/utils/axios')
    const { data } = await api.post('/auth/session', { token })
    return data
  },

  /** DELETE /auth/session — logout */
  async logout() {
    if (USE_MOCK) {
      await sleep(300)
      sessionStorage.removeItem(SESSION_KEY)
      return
    }
    const { signOut } = await import('firebase/auth')
    const { auth } = await import('/utils/firebase')
    await signOut(auth)
    const { default: api } = await import('/utils/axios')
    await api.delete('/auth/session')
  },

  /** GET /auth/session — restore on page load */
  async getSession() {
    if (USE_MOCK) {
      await sleep(300)
      const raw = sessionStorage.getItem(SESSION_KEY)
      if (!raw) throw new Error('No session')
      return JSON.parse(raw)
    }
    const { default: api } = await import('/utils/axios')
    const { data } = await api.get('/auth/session')
    return data.user
  },
}
