import React, { useState, useRef } from 'react'
import { Text, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

export default function EasterEgg() {
  const { config } = useStore()
  const [clicked, setClicked] = useState(false)
  const meshRef = useRef()

  // Slow rotation for the USB/bug icon
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.3
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.03
    }
  })

  return (
    <group position={config.easterEggPosition}>
      {/* A small USB drive / debug icon floating */}
      <group
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {/* USB body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.04]} />
          <meshStandardMaterial color="#1a3a2a" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* USB connector */}
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* LED indicator */}
        <mesh position={[0, -0.05, 0.025]}>
          <boxGeometry args={[0.03, 0.03, 0.01]} />
          <meshBasicMaterial color="#d4af37" toneMapped={false} />
        </mesh>
        {/* Subtle glow */}
        <pointLight position={[0, 0, 0.1]} intensity={0.3} distance={1.5} color="#d4af37" />
      </group>

      {clicked && (
        <Html position={[0, 0.4, 0]} center>
          <div style={{
            background: 'rgba(10, 18, 10, 0.95)',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#d4af37',
            fontSize: '11px',
            fontFamily: "'Fira Code', monospace",
            whiteSpace: 'pre-wrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.2)',
            minWidth: '220px',
            textAlign: 'left',
            lineHeight: '1.6'
          }}>
            <span style={{ color: '#5a8a5a' }}>{'// secret_message.js'}</span>{'\n'}
            {config.easterEggText}
          </div>
        </Html>
      )}
    </group>
  )
}
