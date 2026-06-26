import { motion, AnimatePresence } from 'framer-motion'
import MarkdownIt from 'markdown-it'
import { useChat } from '../hooks/useChat'

const ease = [0.22, 1, 0.36, 1]

const md = new MarkdownIt({ html: true, linkify: true, typographer: true, breaks: false })

const SUGGESTIONS = [
  'What did you build at Modak?',
  'What are your strongest skills?',
  'Are you available to hire?',
]

export function ChatWidget() {
  const {
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
  } = useChat()

  return (
    <div className="cw-wrap">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cw-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.38, ease }}
          >
            {/* Header */}
            <div className="cw-header">
              <div className="cw-header-left">
                <span className="cw-live-dot" />
                <span className="cw-header-title">EK — AI</span>
                <span className="cw-header-sub">Ask me anything</span>
              </div>
              <button className="cw-close" onClick={() => setIsOpen(false)} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 1l10 10M11 1L1 11" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="cw-messages" data-lenis-prevent>
              {history.length === 0 && !prompt.current ? (
                <div className="cw-empty">
                  <div className="cw-empty-mark">EK</div>
                  <p className="cw-empty-label">Ask me about my work, skills, or experience.</p>
                  <div className="cw-suggestions">
                    {SUGGESTIONS.map(s => (
                      <button key={s} className="cw-suggestion" onClick={() => handleSuggestion(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                history.map((msg, i) => (
                  <div key={i} className={`cw-msg cw-msg--${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                    {msg.role === 'assistant' && <span className="cw-msg-tag">EK</span>}
                    <p className="cw-msg-text" dangerouslySetInnerHTML={{ __html: md.render(msg.content) }} />
                  </div>
                ))
              )}
              {prompt.current && (
                <div className="cw-msg cw-msg--user">
                  <p className="cw-msg-text">{prompt.current}</p>
                </div>
              )}
              {prompt.current && (
                <div className="cw-msg cw-msg--ai">
                  <span className="cw-msg-tag">EK</span>
                  <p ref={finalResponse} className="cw-msg-text" />
                </div>
              )}
              {isStreaming && (
                <>
                  {isFirstMessage && (
                    <p className="cw-first-note">First response may take a moment — running on free resources, sorry!</p>
                  )}
                  <div className="cw-typing">
                    <span /><span /><span />
                  </div>
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="cw-disclaimer">AI responses may be inaccurate — verify anything important.</div>

            {/* Input */}
            <div className="cw-input-row">
              <input
                className="cw-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about my work…"
                autoComplete="off"
              />
              <button className="cw-send btn" onClick={handleSend} disabled={!input.trim()} aria-label="Send">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13L13 3M13 3H6M13 3V10" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <button
        className={`cw-trigger ${isOpen ? 'cw-trigger--open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label="Chat with AI Ekamruth"
      >
        <span className="cw-trigger-dot" />
        <span className="cw-trigger-text">{isOpen ? 'Close' : 'Ask EK'}</span>
        <span className="cw-trigger-badge">AI</span>
      </button>
    </div>
  )
}
