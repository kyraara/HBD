import React, { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Wall-mounted LED sconce light with tech aesthetic
 */
function WallSconce({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Bracket */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.3, 0.08, 0.1]} />
        <meshStandardMaterial color="#1a2a1a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* LED strip */}
      <mesh position={[0, -0.02, 0.12]}>
        <boxGeometry args={[0.25, 0.02, 0.02]} />
        <meshBasicMaterial color="#d4af37" toneMapped={false} transparent opacity={0.6} />
      </mesh>
      {/* Downward light */}
      <spotLight 
        position={[0, -0.05, 0.15]} 
        angle={0.8} 
        penumbra={0.9} 
        intensity={0.5} 
        distance={4} 
        color="#d4af37"
        target-position={[0, -2, 0]}
      />
    </group>
  )
}

/**
 * Floating bracket art decoration { } or < /> 
 */
function BracketArt({ position, rotation, text = "{ }", color = "#d4af37" }) {
  const ref = useRef()
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + position[2]) * 0.03
    }
  })

  return (
    <Text
      ref={ref}
      position={position}
      rotation={rotation}
      fontSize={0.35}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.12}
    >
      {text}
    </Text>
  )
}

/**
 * Binary text line on wall
 */
function BinaryLine({ position, rotation, binary = "01001000 01001001" }) {
  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={0.1}
      color="#d4af37"
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.08}
    >
      {binary}
    </Text>
  )
}

/**
 * Circuit node dot on wall
 */
function CircuitNode({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#d4af37" transparent opacity={0.2} toneMapped={false} />
    </mesh>
  )
}

export default function WallDecoration() {
  // Positions between photo frames (photos at z: -6, -13, -20, -27)
  // Decorations go between them
  return (
    <group>
      {/* ===== Wall Sconces (LED lights between photos) ===== */}
      {/* Left wall sconces */}
      <WallSconce position={[-4.9, 2.8, -9.5]} rotation={[0, Math.PI / 2, 0]} />
      <WallSconce position={[-4.9, 2.8, -16.5]} rotation={[0, Math.PI / 2, 0]} />
      <WallSconce position={[-4.9, 2.8, -23.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* Right wall sconces */}
      <WallSconce position={[4.9, 2.8, -9.5]} rotation={[0, -Math.PI / 2, 0]} />
      <WallSconce position={[4.9, 2.8, -16.5]} rotation={[0, -Math.PI / 2, 0]} />
      <WallSconce position={[4.9, 2.8, -23.5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ===== Bracket Art (floating between frames) ===== */}
      {/* Left wall */}
      <BracketArt position={[-4.85, 1.5, -9.5]} rotation={[0, Math.PI / 2, 0]} text="{ }" />
      <BracketArt position={[-4.85, 1.5, -16.5]} rotation={[0, Math.PI / 2, 0]} text="< />" />
      <BracketArt position={[-4.85, 1.5, -23.5]} rotation={[0, Math.PI / 2, 0]} text="( )" />

      {/* Right wall */}
      <BracketArt position={[4.85, 1.5, -9.5]} rotation={[0, -Math.PI / 2, 0]} text="[ ]" />
      <BracketArt position={[4.85, 1.5, -16.5]} rotation={[0, -Math.PI / 2, 0]} text="{ }" />
      <BracketArt position={[4.85, 1.5, -23.5]} rotation={[0, -Math.PI / 2, 0]} text="< />" />

      {/* ===== Binary text on walls ===== */}
      <BinaryLine position={[-4.88, 3.8, -10]} rotation={[0, Math.PI / 2, 0]} binary="01001100 01001111 01010110 01000101" />
      <BinaryLine position={[4.88, 3.8, -17]} rotation={[0, -Math.PI / 2, 0]} binary="01001000 01000010 01000100" />
      <BinaryLine position={[-4.88, 0.5, -20]} rotation={[0, Math.PI / 2, 0]} binary="00110001 00110000 00110000" />

      {/* ===== Circuit nodes (small green dots on walls) ===== */}
      {Array.from({ length: 12 }).map((_, i) => (
        <CircuitNode
          key={`cn-l-${i}`}
          position={[-4.88, 0.8 + Math.random() * 3, -3 - i * 2.5]}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <CircuitNode
          key={`cn-r-${i}`}
          position={[4.88, 0.8 + Math.random() * 3, -3 - i * 2.5]}
        />
      ))}

      {/* ===== Floor LED strips ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0.015, -17.5]}>
        <planeGeometry args={[0.03, 35]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.05} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.5, 0.015, -17.5]}>
        <planeGeometry args={[0.03, 35]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.05} toneMapped={false} />
      </mesh>
    </group>
  )
}
