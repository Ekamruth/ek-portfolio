import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

export function useChat() {
  const { isOpen, setIsOpen, conversationId, setConversationId, history, setHistory, isStreaming, setIsStreaming, isFirstMessage, setIsFirstMessage } = useChatStore()
  const [input, setInput] = useState('')
  const prompt = useRef('')
  const finalResponse = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen && conversationId) {
      async function load() { await getConversationHistory(conversationId) }
      load()
    }
  }, [isOpen])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [history])

  function handleSuggestion(text) {
    setInput(text)
  }

  async function getConversationHistory(id) {
    if (!id) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/conversation/${id}/history`)
    const data = await res.json()
    if (finalResponse.current) finalResponse.current.innerHTML = ''
    setHistory(data.history)
  }

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    prompt.current = trimmed
    setInput('')

    if (conversationId) await getConversationHistory(conversationId)

    setIsStreaming(true)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: prompt.current, conversation_id: conversationId }),
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      for (const line of decoder.decode(value).split('\n')) {
        if (!line.startsWith('data: ')) continue
        const event = JSON.parse(line.slice(6))

        if (event.type === 'conversation_start') {
          setConversationId(event.conversation_id)
        } else if (event.type === 'text_delta') {
          if (finalResponse.current) finalResponse.current.innerHTML += event.text
        } else if (event.type === 'message_end') {
          setIsStreaming(false)
          setIsFirstMessage(false)
        }
      }
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return {
    isOpen, setIsOpen,
    history,
    input, setInput,
    prompt,
    finalResponse,
    messagesEndRef,
    isStreaming,
    isFirstMessage,
    handleSuggestion,
    handleSend,
    handleKey,
  }
}
