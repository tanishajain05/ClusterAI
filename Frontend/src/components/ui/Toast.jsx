import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '@features/ui/uiSlice'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@utils/cn'

const icons = { success: CheckCircle, warning: AlertTriangle, error: XCircle, info: Info }
const styles = {
  success: 'border-green-400/40 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
  warning: 'border-amber-400/40 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200',
  error:   'border-red-400/40 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
  info:    'border-blue-400/40 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
}

function ToastItem({ toast }) {
  const dispatch = useDispatch()
  const Icon = icons[toast.type] || Info

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), toast.duration || 4000)
    return () => clearTimeout(t)
  }, [toast.id])

  return (
    <div className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-toastIn max-w-sm w-full', styles[toast.type] || styles.info)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => dispatch(removeToast(toast.id))} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useSelector((s) => s.ui.toasts)
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end" aria-live="polite">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}
