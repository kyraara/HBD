import React from 'react'
import { Text } from '@react-three/drei'
import DynamicLighting from './DynamicLighting'

export default function Room() {
  const depth = 35;
  const width = 10;
  const height = 5;

  return (
    <group>
      <DynamicLighting />
      
      {/* Hanging Lights with Glowing Bulbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`light-${i}`} position={[0, height, -depth + (i * 6) + 2]}>
          <pointLight 
            position={[0, -0.5, 0]} 
            intensity={0.6} 
            distance={15} 
            color="#ffedd6" 
            decay={2}
          />
          {/* Wire */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.5]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Bulb (toneMapped=false makes it glow with Bloom) */}
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          {/* Lamp shade */}
          <mesh position={[0, -0.4, 0]}>
            <coneGeometry args={[0.3, 0.2, 16]} />
            <meshStandardMaterial color="#111" roughness={0.8} side={2} />
          </mesh>
        </group>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -depth/2]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#3a2512" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Red Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -depth/2]} receiveShadow>
        <planeGeometry args={[3.2, depth]} />
        <meshStandardMaterial color="#881111" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -depth/2]} receiveShadow>
        <planeGeometry args={[3.0, depth]} />
        <meshStandardMaterial color="#a31a1a" roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, -depth/2]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#faf9f5" roughness={1} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width/2, height/2, -depth/2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#ebe5d9" roughness={0.9} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width/2, height/2, -depth/2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#ebe5d9" roughness={0.9} />
      </mesh>
      
      {/* Back Wall (Entrance) */}
      <mesh position={[0, height/2, 2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ebe5d9" roughness={0.9} />
      </mesh>

      {/* Front Wall (Cake room) */}
      <mesh position={[0, height/2, -depth]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#2c303a" roughness={0.8} />
      </mesh>

      {/* Neon Sign "Happy Birthday" */}
      <group position={[0, 3.2, -depth + 0.1]}>
        {/* Glow */}
        <Text
          fontSize={0.8}
          anchorX="center"
          anchorY="middle"
        >
          Happy Birthday
          <meshBasicMaterial color="#ff6b9a" transparent opacity={0.8} toneMapped={false} />
        </Text>
        {/* Core text */}
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.8}
          anchorX="center"
          anchorY="middle"
        >
          Happy Birthday
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </Text>
      </group>

      {/* Baseboards */}
      <mesh position={[-width/2 + 0.05, 0.2, -depth/2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depth, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[width/2 - 0.05, 0.2, -depth/2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depth, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, -depth + 0.05]} rotation={[0, 0, 0]}>
        <boxGeometry args={[width, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Columns Left */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`col-l-${i}`} position={[-width/2 + 0.2, 0, -4 - (i * 7)]}>
          <mesh position={[0, height/2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.2, height, 16]} />
            <meshStandardMaterial color="#f0ead6" roughness={0.8} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#e3ddd1" roughness={0.9} />
          </mesh>
          {/* Top */}
          <mesh position={[0, height - 0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#e3ddd1" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Columns Right */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`col-r-${i}`} position={[width/2 - 0.2, 0, -4 - (i * 7)]}>
          <mesh position={[0, height/2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.2, height, 16]} />
            <meshStandardMaterial color="#f0ead6" roughness={0.8} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#e3ddd1" roughness={0.9} />
          </mesh>
          {/* Top */}
          <mesh position={[0, height - 0.2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#e3ddd1" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 🥚 Easter Egg — Hidden text on the left wall near entrance */}
      <Text
        position={[-4.95, 0.8, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.12}
        color="#c5a059"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        fillOpacity={0.4}
      >
        {"I hid this here because\nI knew you'd explore.\nYou're amazing 💛"}
      </Text>
    </group>
  )
}
