import React, { useState, useRef, useMemo } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'
import { playSwoosh } from '../utils/sfx'

function Gift({ position, color, ribbonColor, message, rotationY = 0 }) {
  const [opened, setOpened] = useState(false)
  const lidRef = useRef()
  const textRef = useRef()
  const { isMuted } = useStore()
  const [hovered, setHovered] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    if (!opened) {
      playSwoosh(isMuted)
      setOpened(true)
    }
  }

  useFrame((state, delta) => {
    if (opened && lidRef.current) {
      // Fly lid up and disappear
      lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, 1.5, delta * 3)
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -Math.PI / 4, delta * 3)
      lidRef.current.children.forEach(child => {
        if (child.material) {
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 0, delta * 4)
        }
      })
    }
    if (opened && textRef.current) {
      // Pop text up
      textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, 1.2, delta * 4)
      textRef.current.fillOpacity = THREE.MathUtils.lerp(textRef.current.fillOpacity, 1, delta * 4)
    }
  })

  // Breathe effect on hover
  useFrame((state) => {
    if (!opened && lidRef.current) {
      const scale = hovered ? 1.05 : 1
      lidRef.current.scale.setScalar(THREE.MathUtils.lerp(lidRef.current.scale.x, scale, 0.1))
    }
  })

  return (
    <group 
      position={position} 
      rotation={[0, rotationY, 0]} 
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* Box */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Box Ribbon */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.52, 0.52, 0.1]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.52, 0.52, 0.1]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.4} />
      </mesh>

      {/* Lid */}
      <group ref={lidRef} position={[0, 0.52, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.1, 0.55]} />
          <meshStandardMaterial color={color} roughness={0.6} transparent />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.56, 0.11, 0.1]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.4} transparent />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.56, 0.11, 0.1]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.4} transparent />
        </mesh>
      </group>

      {/* Surprise Message */}
      <Text
        ref={textRef}
        position={[0, 0.5, 0]}
        fontSize={0.25}
        color={ribbonColor}
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0}
      >
        {message}
      </Text>
    </group>
  )
}

export default function Gifts() {
  const gifts = useMemo(() => [
    { id: 1, position: [-1.8, 0, -43], color: '#ffffff', ribbonColor: '#ff6b9a', rotationY: Math.PI / 6, message: 'I Love You!' },
    { id: 2, position: [1.8, 0, -43.5], color: '#ffeaa7', ribbonColor: '#ff90b3', rotationY: -Math.PI / 8, message: 'You are amazing!' }
  ], [])

  return (
    <group>
      {gifts.map(gift => (
        <Gift key={gift.id} {...gift} />
      ))}
    </group>
  )
}
