import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, Zap, AlertTriangle, ChevronDown, User, CreditCard, LogOut, Shield } from 'lucide-react'
import { toggleTheme, toggleSidebar, setMobileSidebar } from '@features/ui/uiSlice'
import { logoutUser } from '@features/auth/authSlice'
import { cn } from '@utils/cn'

function CreditBadge() {
  const { balance, lowBalanceThreshold } = useSelector((s) => s.credits)
  const navigate = useNavigate()
  const isLow = balance <= lowBalanceThreshold
  return (
    <button
      onClick={() => navigate('/billing')}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
        isLow
          ? 'border-amber-400/60 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 animate-pulse'
          : 'border-[var(--border)] bg-[var(--bg-raised)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
      )}
      aria-label={`Credits: ${balance}${isLow ? ' — low balance' : ''}`}
    >
      {isLow ? <AlertTriangle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-[var(--brand)]" />}
      {balance} credits
    </button>
  )
}

function AvatarMenu() {
  const dispatch = useDispatch()
  const navigate  = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const go = (path) => { setOpen(false); navigate(path) }
  const handleLogout = () => { dispatch(logoutUser()); navigate('/') }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-raised)] transition-colors"
        aria-expanded={open} aria-haspopup="true"
      >
        {user?.photoURL
          ? <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
          : <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0]}</div>
        }
        <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)] max-w-[120px] truncate">{user?.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 py-1 animate-fadeIn">
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
          {[
            { icon: User,       label: 'Profile',  path: '/profile' },
            { icon: CreditCard, label: 'Billing',  path: '/billing' },
            ...(user?.role === 'admin' ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
          ].map(({ icon: Icon, label, path }) => (
            <button key={path} onClick={() => go(path)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)] transition-colors">
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
          <div className="border-t border-[var(--border)] mt-1">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const dispatch = useDispatch()
  const theme = useSelector((s) => s.ui.theme)

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--bg-surface)] shrink-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { dispatch(toggleSidebar()); dispatch(setMobileSidebar(true)) }}
          className="p-2 rounded-lg hover:bg-[var(--bg-raised)] text-[var(--text-muted)] lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hidden lg:block"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--brand)] to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--text-primary)] text-base hidden sm:block">ClusterAI</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <CreditBadge />
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
        <AvatarMenu />
      </div>
    </header>
  )
}
