import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Sidebar from './Sidebar'
import ToastContainer from '@components/ui/Toast'
import { fetchWallet } from '@features/billing/creditsSlice'
import { fetchConversations } from '@features/chat/conversationsSlice'
import { fetchAssets } from '@features/assets/assetsSlice'
import { fetchTransactions } from '@features/billing/transactionsSlice'
import { restoreSession, logoutUser } from '@features/auth/authSlice'
import { addToast } from '@features/ui/uiSlice'

export default function AppShell() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen)
  const user      = useSelector((s) => s.auth.user)

  // Restore session on hard refresh
  useEffect(() => {
    if (!user) dispatch(restoreSession())
  }, [])

  // Bootstrap data once user is known
  useEffect(() => {
    if (!user) return
    dispatch(fetchWallet())
    dispatch(fetchConversations())
    dispatch(fetchAssets())
    dispatch(fetchTransactions())
  }, [user?.uid])

  // Global 401 handler (axios interceptor equivalent for mock)
  useEffect(() => {
    const handle401 = () => {
      dispatch(addToast({ type: 'error', message: 'Session expired — please sign in again.' }))
      dispatch(logoutUser())
      navigate('/')
    }
    window.addEventListener('clusterai:401', handle401)
    return () => window.removeEventListener('clusterai:401', handle401)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
