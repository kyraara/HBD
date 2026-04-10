import React from 'react'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { useStore } from '../store'

export default function PostEffects() {
  const { showLetter } = useStore()

  return (
    <EffectComposer multisampling={0}>
      {/* Bloom — Makes lights, sparkles, and emissive materials glow beautifully */}
      <Bloom
        intensity={showLetter ? 1.2 : 0.8}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur={true}
      />

      {/* Vignette — Darkens edges for cinematic focus */}
      <Vignette
        offset={0.3}
        darkness={showLetter ? 0.85 : 0.65}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Film Grain — Subtle grain for analog/premium feel */}
      <Noise
        opacity={0.035}
        blendFunction={BlendFunction.OVERLAY}
      />

      {/* Chromatic Aberration — Very subtle color fringing for cinematic look */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0008, 0.0008]}
      />
    </EffectComposer>
  )
}
