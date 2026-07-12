import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Pixelation, Bloom, Vignette, Scanline } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { prog } from './progress'
import { useQuestStore } from '../state/useQuestStore'

/*
 * Pixelation-as-narrative:
 *  - spawn: the world "renders in" — granularity eases 18 → 5 during intro
 *  - checkpoint clears / level-up: 350ms glitch spike
 *  - final portal walk-in: the world de-rezzes again
 */
function GranularityDriver({ fx }) {
  useFrame(() => {
    const introEase = THREE.MathUtils.smoothstep(prog.introT, 0.1, 2.4)
    // baseline 3 (finer/cleaner than the old chunky 5) while keeping the
    // retro identity; world still "renders in" from a coarser 10 at spawn
    let g = THREE.MathUtils.lerp(10, 3, introEase)

    const { glitchAt } = useQuestStore.getState()
    const since = (performance.now() - glitchAt) / 1000
    if (since < 0.35) {
      g += (1 - since / 0.35) * (6 + Math.random() * 2)
    }

    if (prog.s > 0.985) {
      g += THREE.MathUtils.smoothstep(prog.s, 0.985, 1) * 8
    }

    if (fx.current) fx.current.granularity = g
  })
  return null
}

export function Effects() {
  const pixel = useRef()
  return (
    <>
      <GranularityDriver fx={pixel} />
      <EffectComposer>
        <Pixelation ref={pixel} granularity={10} />
        <Bloom intensity={0.75} luminanceThreshold={0.25} luminanceSmoothing={0.4} mipmapBlur />
        <Scanline blendFunction={BlendFunction.OVERLAY} density={1.6} opacity={0.04} />
        <Vignette eskil={false} offset={0.2} darkness={0.72} />
      </EffectComposer>
    </>
  )
}
