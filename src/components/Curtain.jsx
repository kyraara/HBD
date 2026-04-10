import React, { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useStore } from '../store'
import * as THREE from 'three'

export default function Curtain({ position = [0, 2.5, -31], zDepth = 0.5 }) {
  const leftCurtainRef = useRef()
  const rightCurtainRef = useRef()
  const { currentWaypoint, maxWaypoints, isUnlocked, controlMode } = useStore()
  const texture = useTexture('/images/curtain.png')
  const [isOpen, setIsOpen] = useState(false)
  const isGuidedOpen = currentWaypoint === maxWaypoints && isUnlocked

  // Make texture seamless and scale correctly
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)

  useFrame((state, delta) => {
    // In manual mode, check camera proximity to the curtain
    let shouldOpen = isGuidedOpen
    if (controlMode === 'manual') {
      shouldOpen = state.camera.position.z < position[2] + 4
    }
    
    // Fallback logic
    if (shouldOpen !== isOpen) {
      setIsOpen(shouldOpen)
    }

    if (leftCurtainRef.current) {
      const targetScaleX = shouldOpen ? 0.15 : 1
      const targetPosX = shouldOpen ? -4.5 : -2.6
      leftCurtainRef.current.scale.x = THREE.MathUtils.lerp(leftCurtainRef.current.scale.x, targetScaleX, delta * 1.5)
      leftCurtainRef.current.position.x = THREE.MathUtils.lerp(leftCurtainRef.current.position.x, targetPosX, delta * 1.5)
    }
    
    if (rightCurtainRef.current) {
      const targetScaleX = shouldOpen ? 0.15 : 1
      const targetPosX = shouldOpen ? 4.5 : 2.6
      rightCurtainRef.current.scale.x = THREE.MathUtils.lerp(rightCurtainRef.current.scale.x, targetScaleX, delta * 1.5)
      rightCurtainRef.current.position.x = THREE.MathUtils.lerp(rightCurtainRef.current.position.x, targetPosX, delta * 1.5)
    }
  })

  return (
    <group position={position}>
      {/* Left Curtain */}
      <mesh ref={leftCurtainRef} position={[-2.6, 0, 0]} castShadow>
        <boxGeometry args={[5.2, 5, zDepth]} />
        <meshStandardMaterial map={texture} roughness={0.9} color="#aa2222" />
      </mesh>
      
      {/* Right Curtain */}
      <mesh ref={rightCurtainRef} position={[2.6, 0, 0]} castShadow>
        <boxGeometry args={[5.2, 5, zDepth]} />
        <meshStandardMaterial map={texture} roughness={0.9} color="#aa2222" />
      </mesh>

      {/* Top Valance (poni tirai) */}
      <mesh position={[0, 2.1, 0.1]} castShadow>
        {/* Width = 10 to span the room */}
        <boxGeometry args={[10.2, 0.8, zDepth + 0.1]} />
        <meshStandardMaterial map={texture} roughness={0.9} color="#881111" />
      </mesh>
    </group>
  )
}
