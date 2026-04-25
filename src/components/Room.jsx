import React from 'react'
import { Text } from '@react-three/drei'
import DynamicLighting from './DynamicLighting'
import SecretDoor from './SecretDoor'
import WallDecoration from './WallDecoration'

export default function Room() {
  const galleryDepth = 35;
  const width = 10;
  const height = 5;

  return (
    <group>
      <DynamicLighting />
      
      {/* Hanging Lights along the gallery */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`light-${i}`} position={[0, height, 3 - (i * 6)]}>
          <pointLight 
            position={[0, -0.5, 0]} 
            intensity={0.5} 
            distance={15} 
            color="#ffedd6"
            decay={2}
          />
          {/* Wire */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.5]} />
            <meshStandardMaterial color="#1a2a1a" />
          </mesh>
          {/* Bulb (green-tinted glow) */}
          <mesh position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.8} />
          </mesh>
          {/* Lamp shade (tech dark) */}
          <mesh position={[0, -0.4, 0]}>
            <coneGeometry args={[0.3, 0.2, 16]} />
            <meshStandardMaterial color="#111" roughness={0.8} side={2} />
          </mesh>
        </group>
      ))}

      {/* ===== GALLERY FLOOR ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -galleryDepth/2]} receiveShadow>
        <planeGeometry args={[width, galleryDepth]} />
        <meshStandardMaterial color="#3a2512" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* LED Carpet (green runner instead of red) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -galleryDepth/2]} receiveShadow>
        <planeGeometry args={[3.2, galleryDepth]} />
        <meshStandardMaterial color="#881111" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -galleryDepth/2]} receiveShadow>
        <planeGeometry args={[3.0, galleryDepth]} />
        <meshStandardMaterial color="#a31a1a" roughness={0.8} />
      </mesh>

      {/* ===== GALLERY CEILING ===== */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, -galleryDepth/2]}>
        <planeGeometry args={[width, galleryDepth]} />
        <meshStandardMaterial color="#faf9f5" roughness={1} />
      </mesh>

      {/* ===== GALLERY WALLS ===== */}
      <mesh position={[-width/2, height/2, -galleryDepth/2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[galleryDepth, height]} />
        <meshStandardMaterial color="#ebe5d9" roughness={0.9} />
      </mesh>

      <mesh position={[width/2, height/2, -galleryDepth/2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[galleryDepth, height]} />
        <meshStandardMaterial color="#ebe5d9" roughness={0.9} />
      </mesh>
      
      {/* Back Wall (Entrance) */}
      <mesh position={[0, height/2, 2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ebe5d9" roughness={0.9} />
      </mesh>

      {/* ===== SECRET DOOR ===== */}
      <SecretDoor position={[0, height/2, -35]} />

      {/* ===== TECH WALL DECORATIONS ===== */}
      <WallDecoration />

      {/* Baseboards (only gallery section) */}
      <mesh position={[-width/2 + 0.05, 0.2, -galleryDepth/2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[galleryDepth, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[width/2 - 0.05, 0.2, -galleryDepth/2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[galleryDepth, 0.4, 0.1]} />
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

      {/* 🥚 Easter Egg — Hidden comment on the left wall near entrance */}
      <Text
        position={[-4.95, 0.8, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.1}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        fillOpacity={0.15}
      >
        {"// I hid this here because\n// I knew you'd explore.\n// You're amazing 💛"}
      </Text>
    </group>
  )
}
