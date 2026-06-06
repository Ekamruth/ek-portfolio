import { useLenis } from '../hooks/useLenis'
import { useHeroPin } from '../hooks/useHeroPin'
import { useClipReveal } from '../hooks/useClipReveal'
import { useHorizontalScroll } from '../hooks/useHorizontalScroll'
import { useColorScrub } from '../hooks/useColorScrub'
import { useParallax } from '../hooks/useParallax'
import { Nav } from './Nav'
import { Hero } from './Hero'
import { Work } from './Work'
import { About } from './About'
import { Contact } from './Contact'
import { Footer } from './Footer'

export function ProfessionalApp() {
  useLenis()
  useHeroPin()
  useClipReveal()
  useHorizontalScroll()
  useColorScrub()
  useParallax()

  return (
    <>
      <Nav />
      <Hero />
      <Work />
      <About />
      <Contact />
      <Footer />
    </>
  )
}
