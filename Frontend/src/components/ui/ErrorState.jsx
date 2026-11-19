import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mb-3" />
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Error</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-xs mb-4">{message}</p>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  )
}
