import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageSquare, Plus } from 'lucide-react'
import {
  createConversation, addMessage, updateMessageContent,
  setMessageStatus, setActiveConversation,
} from './conversationsSlice'
import { optimisticDeduct } from '@features/billing/creditsSlice'
import { addTransaction } from '@features/billing/transactionsSlice'
import { addToast } from '@features/ui/uiSlice'
import { agentService } from '@services/agentService'
import { billingService } from '@services/billingService'
import { AGENT_PRICES } from '@services/mock/mockData'
import { uid } from '@utils/format'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import AgentSelector from './AgentSelector'
import EmptyState from '@components/ui/EmptyState'
import Button from '@components/ui/Button'

export default function ChatPage() {
  const dispatch   = useDispatch()
  const { list: convs, activeId } = useSelector((s) => s.conversations)
  const balance    = useSelector((s) => s.credits.balance)
  const user       = useSelector((s) => s.auth.user)

  const [isStreaming, setIsStreaming] = useState(false)
  const [suggested, setSuggested]    = useState(null)
  const [editingMsg, setEditingMsg]  = useState(null)
  const stopRef    = useRef(false)
  const bottomRef  = useRef()
  const streamMsgId = useRef()

  const activeConv = convs.find((c) => c.id === activeId && c.agentType === 'chat')
  const messages   = activeConv?.messages || []

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  const startNew = () => {
    dispatch(createConversation({ agentType: 'chat', title: 'New chat' }))
    setSuggested(null)
  }

  const handleSend = useCallback(async ({ content, files }) => {
    // Ensure we have an active chat conversation
    let convId = activeId
    if (!activeConv) {
      const newId = uid()
      dispatch(createConversation({ id: newId, agentType: 'chat', title: content.slice(0, 50) }))
      convId = newId
      // small delay to let state settle
      await new Promise((r) => setTimeout(r, 50))
    }

    // Check intent suggestion
    agentService.suggestAgent(content).then(setSuggested)

    // Add user message
    const userMsgId = uid()
    dispatch(addMessage({
      convId,
      message: { id: userMsgId, role: 'user', content, files, createdAt: new Date().toISOString() },
    }))

    // Add empty assistant placeholder
    const asstMsgId = uid()
    streamMsgId.current = asstMsgId
    dispatch(addMessage({
      convId,
      message: { id: asstMsgId, role: 'assistant', content: '', status: 'streaming', createdAt: new Date().toISOString() },
    }))

    setIsStreaming(true)
    stopRef.current = false

    try {
      let fullContent = ''
      for await (const event of agentService.runAgentStream('chat', { prompt: content, convId })) {
        if (stopRef.current) break
        if (event.type === 'token') {
          fullContent += event.value
          dispatch(updateMessageContent({ convId, messageId: asstMsgId, content: fullContent }))
        }
        if (event.type === 'done') {
          const cost = event.creditsUsed || AGENT_PRICES.chat.credits
          dispatch(setMessageStatus({ convId, messageId: asstMsgId, status: 'done' }))
          // Update credits used on message
          dispatch(addMessage({
            convId,
            message: { id: asstMsgId + '_meta', role: '_meta', creditsUsed: cost },
          }))
          // Deduct credits
          dispatch(optimisticDeduct(cost))
          const result = await billingService.deductCredits({ amount: cost, reason: `Chat: ${content.slice(0, 40)}`, agentType: 'chat' })
          dispatch(addTransaction({ ...result.transaction }))
          dispatch(addToast({ type: 'info', message: `${cost} credits used` }))
        }
      }
      // Mark final
      dispatch(updateMessageContent({ convId, messageId: asstMsgId, content: fullContent }))
      dispatch(setMessageStatus({ convId, messageId: asstMsgId, status: 'done' }))
    } catch (err) {
      dispatch(setMessageStatus({ convId, messageId: asstMsgId, status: 'error' }))
      dispatch(addToast({ type: 'error', message: 'Agent error — please try again.' }))
    } finally {
      setIsStreaming(false)
    }
  }, [activeId, activeConv, dispatch])

  const handleStop = () => { stopRef.current = true; setIsStreaming(false) }

  const handleRegenerate = () => {
    // Find last user message and resend
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (lastUser) handleSend({ content: lastUser.content, files: [] })
  }

  const handleEdit = (msg) => setEditingMsg(msg)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-base)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--text-primary)]">
              {activeConv?.title || 'Chat Agent'}
            </h1>
            <p className="text-xs text-[var(--text-muted)]">Multi-turn AI conversation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AgentSelector activeAgent="chat" suggested={suggested} />
          <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />} onClick={startNew}>New</Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-10 h-10" />}
            title="Start a conversation"
            description="Ask anything — the Chat Agent handles multi-turn conversations with full Markdown support."
            action={
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Explain how LangChain works', 'Write a Python sort function', 'What is RAG?'].map((s) => (
                  <button key={s} onClick={() => handleSend({ content: s, files: [] })}
                    className="px-3 py-1.5 text-sm rounded-xl border border-[var(--border)] hover:border-[var(--brand)] hover:bg-[var(--brand-light)] text-[var(--text-secondary)] hover:text-[var(--brand)] transition-all">
                    {s}
                  </button>
                ))}
              </div>
            }
          />
        ) : (
          messages
            .filter((m) => m.role !== '_meta')
            .map((msg, i, arr) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLast={i === arr.length - 1}
                onRegenerate={handleRegenerate}
                onEdit={handleEdit}
              />
            ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isStreaming}
          agentType="chat"
        />
      </div>
    </div>
  )
}
