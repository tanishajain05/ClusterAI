import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Code2, Search, FileText, Sparkles } from 'lucide-react'
import { cn } from '@utils/cn'

const AGENTS = [
  { id: 'chat',     label: 'Chat',    icon: MessageSquare, path: '/chat',   color: 'text-indigo-500',  active: 'bg-indigo-500/10 border-indigo-400/30 text-indigo-500' },
  { id: 'coding',   label: 'Code',    icon: Code2,         path: '/coding', color: 'text-emerald-500', active: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-500' },
  { id: 'search',   label: 'Search',  icon: Search,        path: '/search', color: 'text-amber-500',   active: 'bg-amber-500/10 border-amber-400/30 text-amber-500' },
  { id: 'docmedia', label: 'Docs',    icon: FileText,      path: '/docs',   color: 'text-pink-500',    active: 'bg-pink-500/10 border-pink-400/30 text-pink-500' },
]

export default function AgentSelector({ activeAgent, suggested }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {AGENTS.map(({ id, label, icon: Icon, path, color, active }) => {
        const isActive = id === activeAgent
        const isSuggested = id === suggested
        return (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all',
              isActive
                ? active
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]'
            )}
            aria-pressed={isActive}
          >
            <Icon className={cn('w-3.5 h-3.5', isActive ? '' : color)} />
            {label}
            {isSuggested && !isActive && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--brand)] bg-[var(--brand-light)] px-1.5 py-0.5 rounded-full border border-[var(--brand)]/20">
                <Sparkles className="w-2.5 h-2.5" /> suggested
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
