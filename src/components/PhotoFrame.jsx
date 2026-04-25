import React, { useState, useRef, useMemo } from 'react'
import { useTexture, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

export default function PhotoFrame({ id, url, audioUrl, position, rotation, text, memory }) {
  const texture = useTexture(url)
  const { setLightboxPhoto, config, currentWaypoint, controlMode } = useStore()
  const [hovered, setHovered] = useState(false)
  const frameRef = useRef()
  const glowRef = useRef()
  const hintRef = useRef()

  // Ensure texture renders correctly with proper color space and settings
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    }
  }, [texture])

  // Determine if this frame is the "current focus" in guided mode
  const photoIndex = config.photos.findIndex(p => p.id === id)
  const isFocused = controlMode === 'guided' && currentWaypoint === photoIndex + 1

  const handleClick = (e) => {
    e.stopPropagation()
    const photo = config.photos.find(p => p.id === id)
    if (photo) setLightboxPhoto(photo)
  }

  // Animated spotlight + float effect
  useFrame(({ clock }, delta) => {
    if (frameRef.current) {
      // Subtle floating animation when focused or hovered
      const shouldFloat = isFocused || hovered
      const targetY = shouldFloat ? Math.sin(clock.elapsedTime * 1.5) * 0.015 : 0
      frameRef.current.position.y = THREE.MathUtils.lerp(frameRef.current.position.y, targetY, delta * 3)
    }

    // Pulsing glow ring
    if (glowRef.current) {
      const targetOpacity = isFocused ? 0.3 + Math.sin(clock.elapsedTime * 2) * 0.15 : hovered ? 0.25 : 0
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, targetOpacity, delta * 4)
    }

    // Hint text visibility
    if (hintRef.current) {
      const targetOpacity = isFocused ? 0.6 + Math.sin(clock.elapsedTime * 2.5) * 0.2 : 0
      hintRef.current.fillOpacity = THREE.MathUtils.lerp(hintRef.current.fillOpacity, targetOpacity, delta * 3)
    }
  })

  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto' }}
    >
      <spotLight 
        position={[0, 2, 3]} 
        angle={0.6} 
        penumbra={0.7} 
        intensity={hovered || isFocused ? 8 : 5}
        distance={8}
        castShadow 
      />

      {/* Extra fill light to ensure photo is well-lit */}
      <pointLight 
        position={[0, 0, 2]} 
        intensity={hovered || isFocused ? 3 : 1.5}
        distance={5}
        color="#ffffff"
      />

      {/* Glow ring (visible when focused/hovered) */}
      <mesh ref={glowRef} position={[0, 0, -0.08]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Frame group with float animation */}
      <group ref={frameRef}>
        {/* Frame Background */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.8, 2.8, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>

        {/* Border (classic gold accent) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 3, 0.05]} />
          <meshStandardMaterial color={hovered || isFocused ? "#ffd700" : "#d4af37"} metalness={0.8} roughness={0.2} emissive={hovered || isFocused ? "#3a2a00" : "#000"} />
        </mesh>
        
        {/* Inner mat */}
        <mesh position={[0, 0, 0.031]}>
          <planeGeometry args={[2.6, 2.6]} />
          <meshStandardMaterial color="#f0f0f0" roughness={1} />
        </mesh>

        {/* Photo — using meshBasicMaterial so image shows without needing lighting */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.2, 2.2]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>

      {/* Caption (monospace filename style) */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.18}
        color={hovered || isFocused ? "#d4af37" : "#aaaaaa"}
        anchorX="center"
        anchorY="top"
        maxWidth={3}
        textAlign="center"
      >
        {text}
      </Text>

      {/* Focus hint (visible in guided mode) */}
      <Text
        ref={hintRef}
        position={[0, -2.15, 0]}
        fontSize={0.12}
        color="#d4af37"
        anchorX="center"
        anchorY="top"
        fillOpacity={0}
      >
        {'// click to view'}
      </Text>
    </group>
  )
}
