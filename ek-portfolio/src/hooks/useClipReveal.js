import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useClipReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Section labels: horizontal wipe left → right ─────────
      gsap.utils.toArray('.sec-label').forEach((el) => {
        gsap.from(el, {
          clipPath: 'inset(0 100% 0 0)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      // ── Work items: layered clip-path reveal ─────────────────
      gsap.utils.toArray('.wi').forEach((item) => {
        const num       = item.querySelector('.wi-num')
        const title     = item.querySelector('.wi-title')
        // flex column children after the title (company, desc, impact, tags)
        const flexCol   = item.querySelector('.flex-col')
        const bodyItems = flexCol ? Array.from(flexCol.children).slice(1) : []
        const end       = item.querySelector('.wi-end')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 87%' },
        })

        // Container: start invisible so border doesn't flash before text
        tl.from(item, { opacity: 0, duration: 0.01 }, 0)

        // Number: rises up from below the baseline
        if (num) {
          tl.from(num, {
            clipPath: 'inset(100% 0 0 0)',
            y: 14,
            duration: 0.5,
            ease: 'power3.out',
          }, 0)
        }

        // Title: the hero moment — rises up slightly later, with y-travel
        if (title) {
          tl.from(title, {
            clipPath: 'inset(100% 0 0 0)',
            y: 28,
            duration: 0.72,
            ease: 'power3.out',
          }, 0.07)
        }

        // Year + arrow: slides in from the right
        if (end) {
          tl.from(end, {
            opacity: 0,
            x: 28,
            duration: 0.45,
            ease: 'power2.out',
          }, 0.2)
        }

        // Body content (company, description, impact, tags): staggered fade
        if (bodyItems.length) {
          tl.from(bodyItems, {
            opacity: 0,
            y: 10,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power2.out',
          }, 0.24)
        }
      })
    })

    return () => ctx.revert()
  }, [])
}
