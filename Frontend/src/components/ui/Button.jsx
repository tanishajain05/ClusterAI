import React from 'react'
import { cn } from '@utils/cn'

const variants = {
  primary:  'bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white',
  secondary:'bg-[var(--bg-raised)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)]',
  ghost:    'hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger:   'bg-red-500 hover:bg-red-600 text-white',
  outline:  'border border-[var(--border)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)]',
}
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({ variant = 'primary', size = 'md', className, children, loading, icon, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
        variants[variant], sizes[size], className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {!loading && icon && icon}
      {children}
    </button>
  )
}
