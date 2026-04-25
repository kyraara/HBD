import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

export default function DynamicLighting() {
  const ambientRef = useRef()
  const spotRef = useRef()
  const { curtainOpen } = useStore()
  const { scene } = useThree()

  // Set spotlight target to cake position
  useEffect(() => {
    if (spotRef.current) {
      spotRef.current.target.position.set(0, 0.4, -44)
      scene.add(spotRef.current.target)
    }
    return () => {
      if (spotRef.current) {
        scene.remove(spotRef.current.target)
      }
    }
  }, [scene])

  useFrame((state, delta) => {
    if (ambientRef.current) {
      // Dim global light when curtain is open — slower transition for dramatic effect
      const targetIntensity = curtainOpen ? 0.05 : 0.4
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity, 
        targetIntensity, 
        delta * 0.8  // Slower transition for cinematic dimming
      )
    }

    // Warm spotlight on the cake — fades in when curtain opens, fades out when it closes
    if (spotRef.current) {
      const targetSpot = curtainOpen ? 3.5 : 0
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        targetSpot,
        delta * (curtainOpen ? 1.0 : 2.0)  // Fade in slower, fade out faster
      )
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.4} />
      {/* Warm theatrical spotlight — aimed at cake position (z=-44) */}
      <spotLight
        ref={spotRef}
        position={[0, 6, -43]}
        intensity={0}
        distance={20}
        angle={Math.PI / 6}
        penumbra={0.8}
        color="#ffe4b5"
        castShadow={false}
      />
    </>
  )
}
