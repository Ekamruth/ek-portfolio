import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../../hooks/useChat'

const ease = [0.22, 1, 0.36, 1]

const BOOT_LINES = [
  { role: 'sys', text: 'IDENTITY LOADED: EKAMRUTH_SARMA.EXE' },
  { role: 'ai',  text: 'GREETINGS, TRAVELER.\nI AM EKAMRUTH — FRONTEND ENGINEER.\nASK ME ABOUT MY QUESTS AND SKILLS.' },
]

const SUGGESTIONS = [
  'WHAT DID YOU BUILD?',
  'WHAT ARE YOUR SKILLS?',
  'ARE YOU FOR HIRE?',
]

export function PixelChatWidget() {
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
    <div className="pcw-wrap">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="pcw-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Terminal header */}
            <div className="pcw-header">
              <div className="pixel-chat-dots">
                <span className="pixel-terminal-dot" />
                <span className="pixel-terminal-dot" />
                <span className="pixel-terminal-dot" />
              </div>
              <span className="pcw-title">TALK_TO_EK.EXE</span>
              <button className="pcw-close" onClick={() => setIsOpen(false)} aria-label="Close">✕</button>
            </div>

            {/* Messages */}
            <div className="pcw-messages">
              {BOOT_LINES.map((line, i) => (
                <div key={i} className={`pcw-msg pcw-msg--${line.role}`}>
                  <span className="pcw-prefix">{line.role === 'sys' ? '[SYS]' : '[EK] '}</span>
                  <pre className="pcw-text">{line.text}</pre>
                </div>
              ))}

              {history.length === 0 && !prompt.current ? (
                <div className="pcw-empty">
                  <div className="pcw-suggestions">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        className="pixel-btn pixel-btn--tiny pcw-suggestion"
                        onClick={() => handleSuggestion(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                history.map((msg, i) => (
                  <div key={i} className={`pcw-msg pcw-msg--${msg.role === 'assistant' ? 'ai' : 'user'}`}>
                    <span className="pcw-prefix">{msg.role === 'assistant' ? '[EK] ' : '[YOU]'}</span>
                    <pre className="pcw-text">{msg.content}</pre>
                  </div>
                ))
              )}
              {prompt.current && (
                <div className="pcw-msg pcw-msg--user">
                  <span className="pcw-prefix">[YOU]</span>
                  <pre className="pcw-text">{prompt.current}</pre>
                </div>
              )}
              <div className="pcw-msg pcw-msg--ai">
                <span className="pcw-prefix">[EK] </span>
                <pre ref={finalResponse} className="pcw-text" />
              </div>
              {isStreaming && (
                <>
                  {isFirstMessage && (
                    <div className="pcw-msg pcw-msg--sys">
                      <span className="pcw-prefix">[SYS]</span>
                      <pre className="pcw-text">FREE TIER ACTIVE — FIRST RESPONSE MAY BE SLOW. PLEASE WAIT...</pre>
                    </div>
                  )}
                  <div className="pcw-loader">
                    <span className="pcw-prefix">[EK] </span>
                    <span className="pcw-loader-cursor">_</span>
                  </div>
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="pcw-disclaimer">AI RESPONSES MAY BE INACCURATE — VERIFY ANYTHING IMPORTANT.</div>

            {/* Input */}
            <div className="pcw-input-row">
              <span className="pcw-prompt">&gt;</span>
              <input
                className="pcw-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="TYPE YOUR QUERY..."
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className="pixel-btn pixel-btn--tiny pcw-send"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                SEND
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <button
        className={`pcw-trigger ${isOpen ? 'pcw-trigger--open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label="Chat with AI Ekamruth"
      >
        <span className="pcw-trigger-dot" />
        <span>{isOpen ? 'CLOSE_CHAT' : 'TALK_TO_EK'}</span>
      </button>
    </div>
  )
}
