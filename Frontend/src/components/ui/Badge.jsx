import React from 'react'
import { cn } from '@utils/cn'

const colors = {
  default: 'bg-[var(--bg-raised)] text-[var(--text-secondary)]',
  brand:   'bg-[var(--brand-light)] text-[var(--brand)]',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  chat:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  coding:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  search:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  docmedia:'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}

export default function Badge({ color = 'default', className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', colors[color], className)}>
      {children}
    </span>
  )
}
