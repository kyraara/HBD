import React from 'react'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { useThree } from '@react-three/fiber'
import { useStore } from '../store'

export default function PostEffects() {
  const { showLetter } = useStore()
  const { size } = useThree()
  
  const isMobile = size.width < 768 || size.width < size.height

  // Mobile: lightweight post-processing (Bloom + Vignette only)
  if (isMobile) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.5}
          kernelSize={KernelSize.SMALL}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.5}
          mipmapBlur={false}
        />
        <Vignette
          offset={0.35}
          darkness={0.5}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    )
  }

  // Desktop: full post-processing
  return (
    <EffectComposer multisampling={0}>
      {/* Bloom — Makes lights, sparkles, and emissive materials glow */}
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

      {/* Chromatic Aberration — Subtle color fringing for cinematic look */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0008, 0.0008]}
      />
    </EffectComposer>
  )
}
