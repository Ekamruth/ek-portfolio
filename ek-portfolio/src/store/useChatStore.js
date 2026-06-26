import { create } from 'zustand'

export const useChatStore = create((set) => ({
  isOpen: false,
  conversationId: null,
  history: [],
  isStreaming: false,
  isFirstMessage: true,
  setIsOpen: (isOpen) => set({ isOpen }),
  setConversationId: (id) => set({ conversationId: id }),
  setHistory: (history) => set({ history }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setIsFirstMessage: (isFirstMessage) => set({ isFirstMessage }),
}))
