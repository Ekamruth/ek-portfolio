import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useColorScrub() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cream → warm parchment as About section scrolls into view
      gsap.fromTo('body',
        { backgroundColor: '#f5f2ec' },
        {
          backgroundColor: '#ede4d4',
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            end: 'top top',
            scrub: true,
          },
        }
      )

      // Warm parchment → cream as Contact section scrolls into view
      gsap.fromTo('body',
        { backgroundColor: '#ede4d4' },
        {
          backgroundColor: '#f5f2ec',
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            end: 'top top',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])
}
