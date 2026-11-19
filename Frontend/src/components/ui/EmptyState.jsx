import React from 'react'

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="text-5xl mb-4 opacity-30">{icon}</div>}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--text-muted)] max-w-xs mb-4">{description}</p>}
      {action && action}
    </div>
  )
}
