import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function useScramble(text, { delay = 0 } = {}) {
  const [chars, setChars] = useState([])
  const [started, setStarted] = useState(false)
  const frameRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const ends = [...text].map(() => 10 + Math.floor(Math.random() * 16))

    const timer = setTimeout(() => {
      setStarted(true)
      frameRef.current = 0

      const tick = () => {
        const frame = frameRef.current
        const next = []
        let complete = 0

        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            next.push({ char: ' ', scrambled: false })
            complete++
            continue
          }
          if (frame >= ends[i]) {
            next.push({ char: text[i], scrambled: false })
            complete++
          } else {
            next.push({ char: CHARS[Math.floor(Math.random() * CHARS.length)], scrambled: true })
          }
        }

        setChars(next)

        if (complete < text.length) {
          frameRef.current++
          rafRef.current = requestAnimationFrame(tick)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [text, delay])

  return { chars, started }
}
