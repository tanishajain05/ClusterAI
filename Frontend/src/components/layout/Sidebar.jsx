import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  MessageSquare, Code2, Search, FileText, LayoutDashboard,
  FolderOpen, CreditCard, Shield, Plus, Pin, Trash2, Pencil, X, ChevronDown,
} from 'lucide-react'
import { setMobileSidebar, setActiveAgent } from '@features/ui/uiSlice'
import {
  createConversation, setActiveConversation,
  renameConversation, pinConversation, deleteConversation, setSearchQuery,
} from '@features/chat/conversationsSlice'
import { cn } from '@utils/cn'
import { timeAgo, truncate } from '@utils/format'

const AGENTS = [
  { id: 'chat',     label: 'Chat',       icon: MessageSquare, path: '/chat',    color: 'text-indigo-500',   bg: 'bg-indigo-500/10' },
  { id: 'coding',   label: 'Coding',     icon: Code2,         path: '/coding',  color: 'text-emerald-500',  bg: 'bg-emerald-500/10' },
  { id: 'search',   label: 'Search',     icon: Search,        path: '/search',  color: 'text-amber-500',    bg: 'bg-amber-500/10' },
  { id: 'docmedia', label: 'Docs/Media', icon: FileText,      path: '/docs',    color: 'text-pink-500',     bg: 'bg-pink-500/10' },
]

const NAV_LINKS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Assets',    icon: FolderOpen,      path: '/assets' },
  { label: 'Billing',   icon: CreditCard,      path: '/billing' },
]

function ConversationItem({ conv, onRename }) {
  const dispatch = useDispatch()
  const navigate  = useNavigate()
  const activeId  = useSelector((s) => s.conversations.activeId)
  const [hovering, setHovering] = useState(false)

  const isActive = conv.id === activeId
  const agentMeta = AGENTS.find((a) => a.id === conv.agentType)

  const handleClick = () => {
    dispatch(setActiveConversation(conv.id))
    const path = agentMeta?.path || '/chat'
    navigate(path)
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        'group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-sm',
        isActive ? 'bg-[var(--brand-light)] text-[var(--brand)]' : 'hover:bg-[var(--bg-raised)] text-[var(--text-secondary)]'
      )}
      onClick={handleClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {conv.pinned && <Pin className="w-3 h-3 shrink-0 opacity-50" />}
      <span className="flex-1 truncate">{truncate(conv.title, 28)}</span>
      {(hovering || isActive) && (
        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onRename(conv)} className="p-1 rounded hover:bg-[var(--bg-muted)]" aria-label="Rename"><Pencil className="w-3 h-3" /></button>
          <button onClick={() => dispatch(pinConversation(conv.id))} className="p-1 rounded hover:bg-[var(--bg-muted)]" aria-label="Pin"><Pin className="w-3 h-3" /></button>
          <button onClick={() => dispatch(deleteConversation(conv.id))} className="p-1 rounded hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20" aria-label="Delete"><Trash2 className="w-3 h-3" /></button>
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { sidebarOpen, mobileSidebarOpen } = useSelector((s) => s.ui)
  const user      = useSelector((s) => s.auth.user)
  const { list: convs, searchQuery } = useSelector((s) => s.conversations)
  const [historyOpen, setHistoryOpen] = useState(true)
  const [renamingConv, setRenamingConv] = useState(null)
  const [renameVal, setRenameVal] = useState('')

  const filtered = convs.filter((c) =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const pinned   = filtered.filter((c) => c.pinned)
  const unpinned = filtered.filter((c) => !c.pinned)

  const handleNew = (agentType = 'chat') => {
    const path = AGENTS.find((a) => a.id === agentType)?.path || '/chat'
    dispatch(createConversation({ agentType }))
    dispatch(setActiveAgent(agentType))
    navigate(path)
    dispatch(setMobileSidebar(false))
  }

  const startRename = (conv) => { setRenamingConv(conv.id); setRenameVal(conv.title) }
  const commitRename = () => {
    if (renameVal.trim()) dispatch(renameConversation({ id: renamingConv, title: renameVal.trim() }))
    setRenamingConv(null)
  }

  const isVisible = sidebarOpen
  const baseClass = 'flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border)] overflow-y-auto transition-all duration-300'

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => dispatch(setMobileSidebar(false))}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          baseClass,
          'fixed top-0 left-0 z-40 h-screen lg:static lg:z-auto',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isVisible ? 'w-[260px]' : 'w-0 lg:w-16 overflow-hidden',
        )}
        style={{ width: isVisible ? '260px' : undefined }}
        aria-label="Sidebar navigation"
      >
        {/* Logo row (mobile) */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--border)] lg:hidden">
          <span className="font-bold text-[var(--text-primary)]">ClusterAI</span>
          <button onClick={() => dispatch(setMobileSidebar(false))} className="p-1 rounded-lg hover:bg-[var(--bg-raised)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {/* New chat */}
          <button
            onClick={() => handleNew('chat')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-sm font-semibold transition-colors mb-3"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>

          {/* Agents */}
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Agents</p>
          {AGENTS.map(({ id, label, icon: Icon, path, color, bg }) => (
            <NavLink key={id} to={path}
              onClick={() => { dispatch(setActiveAgent(id)); dispatch(setMobileSidebar(false)) }}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? `${bg} ${color}` : 'text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon className={cn('w-4 h-4', color)} /> {label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-[var(--border)]" />

          {/* Nav links */}
          {NAV_LINKS.map(({ label, icon: Icon, path }) => (
            <NavLink key={path} to={path}
              onClick={() => dispatch(setMobileSidebar(false))}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-[var(--brand-light)] text-[var(--brand)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => dispatch(setMobileSidebar(false))}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-[var(--brand-light)] text-[var(--brand)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
              )}
            >
              <Shield className="w-4 h-4" /> Admin
            </NavLink>
          )}

          <div className="my-2 border-t border-[var(--border)]" />

          {/* Conversation history */}
          <button
            onClick={() => setHistoryOpen((p) => !p)}
            className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            History <ChevronDown className={cn('w-3 h-3 transition-transform', historyOpen ? '' : '-rotate-90')} />
          </button>

          {historyOpen && (
            <>
              <input
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search conversations…"
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--border-focus)] mb-1"
                aria-label="Search conversations"
              />
              {pinned.length > 0 && (
                <>
                  <p className="px-2 text-[10px] text-[var(--text-muted)] mt-1">Pinned</p>
                  {pinned.map((c) => renamingConv === c.id
                    ? <RenameInput key={c.id} value={renameVal} onChange={setRenameVal} onCommit={commitRename} />
                    : <ConversationItem key={c.id} conv={c} onRename={startRename} />
                  )}
                  <div className="my-1 border-t border-[var(--border)]" />
                </>
              )}
              {unpinned.map((c) => renamingConv === c.id
                ? <RenameInput key={c.id} value={renameVal} onChange={setRenameVal} onCommit={commitRename} />
                : <ConversationItem key={c.id} conv={c} onRename={startRename} />
              )}
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-xs text-[var(--text-muted)]">No conversations yet</p>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  )
}

function RenameInput({ value, onChange, onCommit }) {
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => { if (e.key === 'Enter') onCommit(); if (e.key === 'Escape') onCommit() }}
      className="w-full px-2 py-1.5 text-sm rounded-lg bg-[var(--bg-raised)] border border-[var(--border-focus)] text-[var(--text-primary)] outline-none mb-0.5"
    />
  )
}
