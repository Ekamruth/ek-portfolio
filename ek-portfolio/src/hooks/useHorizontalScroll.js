import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHorizontalScroll() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 54rem)', () => {
        const track = document.querySelector('.work-track')
        const wrapper = document.querySelector('.work-sticky-wrapper')
        if (!track || !wrapper) return

        const getDistance = () => track.scrollWidth - window.innerWidth

        const updateHeight = () => {
          wrapper.style.height = `${window.innerHeight + getDistance()}px`
        }
        updateHeight()

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            invalidateOnResize: true,
            onRefresh: updateHeight,
          },
        })

        gsap.to('.work-progress-fill', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 0.5,
            invalidateOnResize: true,
          },
        })

        return () => { wrapper.style.height = '' }
      })
    })

    return () => ctx.revert()
  }, [])
}
