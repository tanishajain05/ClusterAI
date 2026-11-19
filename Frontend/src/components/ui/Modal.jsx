import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { closeModal } from '@features/ui/uiSlice'
import { cn } from '@utils/cn'

export default function Modal({ title, children, size = 'md', onClose }) {
  const dispatch = useDispatch()
  const handleClose = onClose || (() => dispatch(closeModal()))

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={cn('relative w-full bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border)] animate-fadeIn', widths[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-primary)]">{title}</h2>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
