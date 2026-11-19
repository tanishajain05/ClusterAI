import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppShell from '@components/layout/AppShell'
import PageSkeleton from '@components/ui/PageSkeleton'

const Landing     = lazy(() => import('@features/auth/Landing'))
const Dashboard   = lazy(() => import('@features/dashboard/Dashboard'))
const ChatPage    = lazy(() => import('@features/chat/ChatPage'))
const CodingPage  = lazy(() => import('@features/coding/CodingPage'))
const SearchPage  = lazy(() => import('@features/search/SearchPage'))
const DocPage     = lazy(() => import('@features/docmedia/DocPage'))
const BillingPage = lazy(() => import('@features/billing/BillingPage'))
const AssetsPage  = lazy(() => import('@features/assets/AssetsPage'))
const ProfilePage = lazy(() => import('@features/dashboard/ProfilePage'))
const AdminPage   = lazy(() => import('@features/admin/AdminPage'))

function RequireAuth({ children }) {
  const user = useSelector((s) => s.auth.user)
  if (!user) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }) {
  const user = useSelector((s) => s.auth.user)
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

// Redirect logged-in users away from landing
function PublicOnly({ children }) {
  const user = useSelector((s) => s.auth.user)
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function Wrap({ children }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrap><PublicOnly><Landing /></PublicOnly></Wrap>,
  },
  {
    path: '/',
    element: <RequireAuth><AppShell /></RequireAuth>,
    children: [
      { path: 'dashboard', element: <Wrap><Dashboard /></Wrap> },
      { path: 'chat',      element: <Wrap><ChatPage /></Wrap> },
      { path: 'coding',    element: <Wrap><CodingPage /></Wrap> },
      { path: 'search',    element: <Wrap><SearchPage /></Wrap> },
      { path: 'docs',      element: <Wrap><DocPage /></Wrap> },
      { path: 'billing',   element: <Wrap><BillingPage /></Wrap> },
      { path: 'assets',    element: <Wrap><AssetsPage /></Wrap> },
      { path: 'profile',   element: <Wrap><ProfilePage /></Wrap> },
      {
        path: 'admin',
        element: <RequireAdmin><Wrap><AdminPage /></Wrap></RequireAdmin>,
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])
