import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useParallax() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 54rem)', () => {
        // Background EK mark drifts up at 2× scroll speed — deepest layer
        gsap.to('.h-bg-mark', {
          y: -240,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=100%',
            scrub: true,
          },
        })

        // About section: stats block floats up slightly slower than content
        gsap.to('.stats', {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])
}
