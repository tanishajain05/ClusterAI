import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Copy, Check, RefreshCw, Pencil, Zap } from 'lucide-react'
import MarkdownRenderer from '@components/ui/MarkdownRenderer'
import { cn } from '@utils/cn'
import { timeAgo } from '@utils/format'

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
          style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  )
}

export default function MessageBubble({ message, onRegenerate, onEdit, isLast }) {
  const user = useSelector((s) => s.auth.user)
  const [copied, setCopied] = useState(false)

  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'
  const isEmpty = !message.content && isStreaming

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={cn('flex gap-3 group animate-fadeIn', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          user?.photoURL
            ? <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            : <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]}
              </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={cn('flex flex-col max-w-[78%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-[var(--brand)] text-white rounded-tr-sm'
              : 'bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm'
          )}
        >
          {isEmpty ? <TypingDots /> : (
            isUser
              ? <p className="whitespace-pre-wrap">{message.content}</p>
              : <MarkdownRenderer content={message.content || ''} />
          )}
          {isStreaming && !isEmpty && (
            <span className="inline-block w-0.5 h-4 bg-[var(--brand)] animate-pulse ml-0.5 align-text-bottom" />
          )}
        </div>

        {/* Meta row */}
        <div className={cn('flex items-center gap-2 mt-1 px-1', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-[10px] text-[var(--text-muted)]">{timeAgo(message.createdAt)}</span>

          {/* Credits used badge */}
          {message.creditsUsed && (
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" /> {message.creditsUsed} cr
            </span>
          )}

          {/* File chips */}
          {message.files?.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {message.files.map((f, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-muted)] flex items-center gap-1">
                  📎 {f.name}
                  {f.status === 'embedding' && <span className="animate-pulse">…</span>}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons — show on hover */}
          {!isStreaming && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1 rounded hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Copy message">
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
              {!isUser && isLast && onRegenerate && (
                <button onClick={onRegenerate} className="p-1 rounded hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Regenerate">
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
              {isUser && onEdit && (
                <button onClick={() => onEdit(message)} className="p-1 rounded hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Edit">
                  <Pencil className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
