import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Zap, MessageSquare, Code2, Search, FileText,
  CheckCircle, AlertCircle, Coins, ArrowRight, Star,
} from 'lucide-react'
import { loginWithGoogle, clearError } from './authSlice'
import { setBalance } from '@features/billing/creditsSlice'
import { addToast } from '@features/ui/uiSlice'
import Button from '@components/ui/Button'
import { cn } from '@utils/cn'

const AGENTS = [
  {
    id: 'chat', icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Chat Agent', desc: 'Multi-turn conversations with streamed replies, Markdown rendering, and saved history.',
    credits: '2 credits / message',
  },
  {
    id: 'coding', icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Coding Agent', desc: 'Generate, debug, and review code. Live preview of HTML/CSS/JS in a sandboxed iframe.',
    credits: '5 credits / generation',
  },
  {
    id: 'search', icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Search Agent', desc: 'Real-time web search with synthesised answers, numbered citations, and related images.',
    credits: '3 credits / search',
  },
  {
    id: 'docs', icon: FileText, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20',
    title: 'Docs / Media', desc: 'Generate PDF reports, PowerPoint decks, and AI images through a guided pipeline.',
    credits: '8–20 credits / file',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Sign in with Google', desc: 'One click — no password needed. Get 100 free starter credits instantly.' },
  { step: '02', title: 'Pick an agent', desc: 'Chat, Code, Search, or Docs. Each agent is optimised for its task.' },
  { step: '03', title: 'Top up when you need', desc: 'Credits never expire. Buy a pack anytime from ₹99.' },
]

export default function Landing() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { status, error, user } = useSelector((s) => s.auth)

  // If already logged in, redirect
  useEffect(() => { if (user) navigate('/dashboard') }, [user])

  const handleLogin = async () => {
    dispatch(clearError())
    const result = await dispatch(loginWithGoogle())
    if (loginWithGoogle.fulfilled.match(result)) {
      const { firstLogin } = result.payload
      // Grant 100 starter credits on first login
      if (firstLogin) {
        dispatch(setBalance(100))
        dispatch(addToast({ type: 'success', message: '🎉 100 free starter credits granted! Welcome to ClusterAI.' }))
      }
      navigate('/dashboard')
    }
  }

  // Map error codes to friendly messages
  const friendlyError = (() => {
    if (!error) return null
    if (error.includes('popup-closed') || error.includes('cancelled'))
      return 'Sign-in popup was closed. Please try again.'
    if (error.includes('popup-blocked'))
      return 'Popup was blocked by your browser. Please allow popups for this site.'
    if (error.includes('account-exists'))
      return 'An account already exists with a different sign-in method.'
    if (error.includes('blocked') || error.includes('disabled'))
      return 'This account has been blocked. Please contact support.'
    if (error.includes('network'))
      return 'Network error — please check your connection and try again.'
    return error
  })()

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ClusterAI</span>
        </div>
        <Button onClick={handleLogin} loading={status === 'loading'} size="sm">
          Sign in
        </Button>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-pink-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-light)] text-[var(--brand)] text-xs font-semibold mb-6 border border-[var(--brand)]/20">
            <Star className="w-3 h-3" /> Production-Ready Multi-Agent AI Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5 bg-gradient-to-r from-[var(--text-primary)] via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Four AI Agents.<br />One Workspace.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-10">
            Chat, code, search the web, and generate documents — all in a unified platform. Pay only for what you use with prepaid credits.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleLogin}
              disabled={status === 'loading'}
              className={cn(
                'flex items-center gap-3 px-6 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed',
                'bg-white dark:bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)]'
              )}
            >
              {status === 'loading'
                ? <span className="w-5 h-5 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
                : <GoogleIcon />
              }
              Continue with Google
            </button>
            <p className="text-xs text-[var(--text-muted)]">Free 100 credits on sign-up · No credit card needed</p>
          </div>

          {/* Error state */}
          {friendlyError && (
            <div className="mt-4 flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm max-w-sm mx-auto animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {friendlyError}
            </div>
          )}
        </div>
      </section>

      {/* ── Agents grid ─────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Four Specialised Agents</h2>
          <p className="text-[var(--text-secondary)]">Each agent is built for a specific task — no one-size-fits-all prompting.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AGENTS.map(({ id, icon: Icon, color, bg, title, desc, credits }) => (
            <div key={id} className={cn('p-5 rounded-2xl border bg-[var(--bg-surface)] hover:scale-[1.02] transition-transform cursor-default', bg)}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">{desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-raised)] px-2 py-1 rounded-full">
                <Coins className="w-3 h-3" /> {credits}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How credits work ────────────────────────────────── */}
      <section className="px-6 py-16 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">How Credits Work</h2>
            <p className="text-[var(--text-secondary)]">Simple, transparent, no surprises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step}
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing preview */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Starter', credits: '100 credits', price: '₹99', note: 'Try it out' },
              { name: 'Pro',     credits: '500 credits', price: '₹399', note: 'Most popular', highlight: true },
              { name: 'Max',     credits: '1500 credits',price: '₹999', note: 'Power users' },
            ].map(({ name, credits, price, note, highlight }) => (
              <div key={name} className={cn(
                'p-5 rounded-2xl border text-center transition-all',
                highlight ? 'border-[var(--brand)] bg-[var(--brand-light)] shadow-lg shadow-indigo-500/10' : 'border-[var(--border)] bg-[var(--bg-raised)]'
              )}>
                {highlight && <span className="text-xs font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-full mb-2 inline-block">Most Popular</span>}
                <div className="text-2xl font-extrabold mb-0.5">{price}</div>
                <div className="font-semibold text-sm mb-1">{name}</div>
                <div className="text-sm text-[var(--text-secondary)]">{credits}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features checklist ──────────────────────────────── */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Everything you need</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Streamed AI replies in real-time',
            'Live code preview in sandboxed iframe',
            'Web search with cited sources',
            'PDF & PPT generation pipeline',
            'AI image generation',
            'Credit ledger & receipts',
            'Light and dark themes',
            'Mobile-friendly responsive UI',
            'Conversation history & search',
            'Asset library with download',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="px-6 py-20 text-center bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-t border-[var(--border)]">
        <h2 className="text-3xl font-bold mb-3">Ready to try ClusterAI?</h2>
        <p className="text-[var(--text-secondary)] mb-8">Get 100 free credits. No credit card required.</p>
        <button
          onClick={handleLogin}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60"
        >
          {status === 'loading'
            ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <GoogleIcon white />
          }
          Continue with Google
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="px-6 py-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
        © 2026 ClusterAI · Built with React + Vite · Powered by LangChain & LangGraph
      </footer>
    </div>
  )
}

function GoogleIcon({ white = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
      <path fill={white ? '#fff' : '#4285F4'} d="M44.5 20H24v8.5h11.7C34.6 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l6-6C34.4 6.5 29.5 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 20-8.1 20-20.5 0-1-.1-2-.5-5z"/>
      {!white && <>
        <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.2 19.1 13.5 24 13.5c3.1 0 5.9 1.1 8 3l6-6C34.4 6.5 29.5 4.5 24 4.5c-7.9 0-14.6 4.6-17.7 10.2z"/>
        <path fill="#FBBC05" d="M24 45.5c5.4 0 10.3-1.8 14-4.9l-6.5-5.3C29.5 37.2 26.9 38 24 38c-5.7 0-10.5-3.8-12.2-9l-7 5.4C7.8 41 15.4 45.5 24 45.5z"/>
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.6-2.5 4.8-4.8 6.3l6.5 5.3c3.8-3.5 6.1-8.6 6.1-14.6 0-1-.1-2-.5-5z"/>
      </>}
    </svg>
  )
}
