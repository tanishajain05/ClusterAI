import React, { useState, lazy, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'

// Lazy-load the heavy syntax highlighter to keep the initial bundle small
const SyntaxHighlighter = lazy(() =>
  import('react-syntax-highlighter').then((m) => ({ default: m.Prism }))
)
const oneDarkPromise = import('react-syntax-highlighter/dist/esm/styles/prism').then((m) => m.oneDark)
let oneDark = null
oneDarkPromise.then((s) => { oneDark = s })

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose max-w-none text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeText = String(children).replace(/\n$/, '')
            if (!inline && match) {
              return (
                <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-700">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                    <span className="text-xs text-slate-400 font-mono">{match[1]}</span>
                    <CopyButton text={codeText} />
                  </div>
                  <Suspense fallback={<pre className="p-4 text-xs text-slate-300 bg-slate-900 overflow-auto">{codeText}</pre>}>
                    <SyntaxHighlighter
                      style={oneDark || {}}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8rem', background: '#0f172a' }}
                      {...props}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                  </Suspense>
                </div>
              )
            }
            return (
              <code className="px-1.5 py-0.5 rounded bg-[var(--bg-raised)] text-[var(--brand)] text-xs font-mono" {...props}>
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full text-xs border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 bg-[var(--bg-raised)] border border-[var(--border)] font-semibold text-left">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border border-[var(--border)]">{children}</td>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] underline hover:opacity-80">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[var(--brand)] pl-4 my-2 text-[var(--text-secondary)] italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
