import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHeroPin() {
  useEffect(() => {
    let ctx

    const setup = () => {
      const nameEl    = document.querySelector('.h-name')
      const navLogoEl = document.querySelector('.nav-logo')
      if (!nameEl || !navLogoEl) return

      // Measure both elements AFTER Framer Motion entrance is done
      const nb = nameEl.getBoundingClientRect()
      const lb = navLogoEl.getBoundingClientRect()

      // How much to shrink: logo height / name height
      const targetScale = lb.height / nb.height

      // Move the name's center to the logo's center
      const dx = (lb.left + lb.width  / 2) - (nb.left + nb.width  / 2)
      const dy = (lb.top  + lb.height / 2) - (nb.top  + nb.height / 2)

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=100%',       // pin for 100vh of extra scroll
            pin: true,
            pinSpacing: false,
            scrub: 1.5,
            anticipatePin: 1,
          },
        })

        tl
          // supporting elements exit first
          .to('.h-status',  { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 0)
          // vlines exit asymmetrically — creates parallax depth impression
          .to('.vline:nth-child(2)', { opacity: 0, y: -110, duration: 0.45, ease: 'power2.in' }, 0)
          .to('.vline:nth-child(3)', { opacity: 0, y: 90,   duration: 0.45, ease: 'power2.in' }, 0.04)
          .to('.h-meta',    { opacity: 0, y: 24,  duration: 0.35, ease: 'power2.in' }, 0.08)
          // name shrinks and flies to nav logo position
          .to('.h-name', {
            scale: targetScale,
            x: dx,
            y: dy,
            duration: 0.85,
            ease: 'power3.inOut',
          }, 0.18)
          // fade it out right before pin releases
          .to('.h-name', { opacity: 0, duration: 0.12 }, 0.88)
      })
    }

    // Wait for Framer Motion entrance animations to complete (~1.5s max)
    // before measuring element positions for the transform calculation
    const timer = setTimeout(setup, 1600)

    return () => {
      clearTimeout(timer)
      ctx?.revert()
    }
  }, [])
}
