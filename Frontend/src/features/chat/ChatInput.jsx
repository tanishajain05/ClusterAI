import React, { useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Send, Paperclip, X, Square, Zap, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@utils/cn'
import { AGENT_PRICES } from '@services/mock/mockData'

export default function ChatInput({ onSend, onStop, isStreaming, agentType = 'chat', disabled }) {
  const navigate   = useNavigate()
  const balance    = useSelector((s) => s.credits.balance)
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const textareaRef = useRef()
  const fileRef = useRef()

  const cost = AGENT_PRICES[agentType]?.credits || 2
  const insufficient = balance < cost

  const handleSend = () => {
    if (!text.trim() || isStreaming || insufficient) return
    onSend({ content: text.trim(), files })
    setText('')
    setFiles([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const addFiles = (newFiles) => {
    const mapped = Array.from(newFiles).map((f) => ({ name: f.name, size: f.size, status: 'embedding' }))
    setFiles((p) => [...p, ...mapped])
    // Simulate embedding completing
    mapped.forEach((_, i) => {
      setTimeout(() => {
        setFiles((prev) => prev.map((f, j) => j === i ? { ...f, status: 'ready' } : f))
      }, 1200 + i * 400)
    })
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Insufficient credits warning */}
      {insufficient && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs animate-fadeIn">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Insufficient credits ({balance} left, need {cost}).</span>
          <button onClick={() => navigate('/billing')} className="underline font-semibold hover:opacity-80">Top up</button>
        </div>
      )}

      {/* File chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {files.map((f, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
              📎 {f.name}
              {f.status === 'embedding' && <span className="text-[var(--brand)] animate-pulse">embedding…</span>}
              {f.status === 'ready'     && <span className="text-emerald-500">✓</span>}
              <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="hover:text-red-500 ml-0.5" aria-label="Remove file">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex items-end gap-2 p-3 rounded-2xl border bg-[var(--bg-surface)] transition-all',
          dragging ? 'border-[var(--brand)] bg-[var(--brand-light)]' : 'border-[var(--border)]',
          'focus-within:border-[var(--border-focus)]'
        )}
      >
        {/* File attach */}
        <button
          onClick={() => fileRef.current?.click()}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors shrink-0"
          aria-label="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px' }}
          onKeyDown={handleKeyDown}
          placeholder={dragging ? 'Drop files here…' : `Message ${agentType} agent… (Shift+Enter for new line)`}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none min-h-[36px] max-h-[160px] leading-relaxed py-1"
          aria-label="Message input"
        />

        {/* Credit cost chip */}
        {text.trim() && !isStreaming && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--bg-raised)] px-2 py-1 rounded-full self-end mb-1">
            <Zap className="w-2.5 h-2.5" /> {cost}
          </span>
        )}

        {/* Send / Stop */}
        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors self-end"
            aria-label="Stop generation"
          >
            <Square className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!text.trim() || insufficient}
            className="shrink-0 p-2 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-center text-[10px] text-[var(--text-muted)] mt-1.5">
        ClusterAI can make mistakes. Verify important information.
      </p>
    </div>
  )
}
