import { PixelNav } from './PixelNav'
import { PixelHero } from './PixelHero'
import { PixelWork } from './PixelWork'
import { PixelAbout } from './PixelAbout'
import { PixelContact } from './PixelContact'
import { PixelFooter } from './PixelFooter'
import { PixelSprites } from './PixelSprites'
import { PixelClouds, PixelDivider } from './PixelTerrain'

export function GamifiedApp() {
  return (
    <div className="pixel-world">
      <PixelSprites />
      <PixelClouds />
      <PixelNav />
      <PixelHero />
      <PixelDivider />
      <PixelWork />
      <PixelDivider />
      <PixelAbout />
      <PixelDivider />
      <PixelContact />
      <PixelFooter />
    </div>
  )
}
