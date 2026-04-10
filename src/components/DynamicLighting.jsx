import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

export default function DynamicLighting() {
  const ambientRef = useRef()
  const { currentWaypoint, maxWaypoints, isUnlocked, controlMode } = useStore()
  
  const isGuidedAtCake = currentWaypoint === maxWaypoints && isUnlocked

  useFrame((state, delta) => {
    let isAtCake = isGuidedAtCake
    if (controlMode === 'manual') {
      // Cake is around z=-33, check if camera is close
      isAtCake = state.camera.position.z < -27
    }

    if (ambientRef.current) {
      // Dim global light drastically at the cake for dramatic effect
      const targetIntensity = isAtCake ? 0.05 : 0.4
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, targetIntensity, delta * 1.5)
    }
  })

  return <ambientLight ref={ambientRef} intensity={0.4} />
}
