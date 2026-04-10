import React, { useState } from 'react'
import { useTexture, Text } from '@react-three/drei'
import { useStore } from '../store'

export default function PhotoFrame({ id, url, audioUrl, position, rotation, text, memory }) {
  const texture = useTexture(url)
  const { setLightboxPhoto, config } = useStore()
  const [hovered, setHovered] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    const photo = config.photos.find(p => p.id === id)
    if (photo) setLightboxPhoto(photo)
  }

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
        intensity={hovered ? 6 : 4}
        distance={6}
        castShadow 
      />

      {/* Frame Background */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.8, 2.8, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Gold Border */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 0.05]} />
        <meshStandardMaterial color={hovered ? "#e0c060" : "#c5a059"} metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Passpartout */}
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>

      {/* Photo */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Caption */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color={hovered ? "#c5a059" : "#ffffff"}
        anchorX="center"
        anchorY="top"
        maxWidth={3}
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  )
}
