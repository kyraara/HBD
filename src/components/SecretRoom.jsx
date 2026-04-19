import React from 'react'
import { Sparkles, Text } from '@react-three/drei'
import Cake from './Cake'
import Gifts from './Gifts'
import Curtain from './Curtain'
import EasterEgg from './EasterEgg'
import { useStore } from '../store'

// Small reusable component for a single candle
function Candle({ position }) {
  return (
    <group position={position}>
      {/* Small Wax */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.3} />
      </mesh>
      {/* Small Flame Glow */}
      <pointLight position={[0, 0.1, 0]} intensity={0.5} distance={5} color="#ffaa00" />
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffcc00" toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function SecretRoom() {
  const isUnlocked = useStore(s => s.isSecretRoomUnlocked)
  
  if (!isUnlocked) return null // Lazy loading

  // All positions in world coordinates (behind the door at z=-35)
  const candlePositions = [
    [-3, 0.4, -39], [3, 0.4, -39],
    [-4, 0.4, -43], [4, 0.4, -43],
    [-2, 0.4, -46], [2, 0.4, -46],
    [-3.5, 0.4, -38], [3.5, 0.4, -38]
  ]

  return (
    <group>
      {/* Dark floor for the birthday room (extends behind door from z=-35 to z=-55) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -45]} receiveShadow>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color="#0c0705" roughness={0.9} />
      </mesh>

      {/* Dark ceiling for the birthday room */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, -45]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>

      {/* Dark side walls for the birthday room */}
      <mesh position={[-5, 2.5, -45]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#080605" roughness={0.9} />
      </mesh>
      <mesh position={[5, 2.5, -45]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#080605" roughness={0.9} />
      </mesh>

      {/* Back wall of birthday room */}
      <mesh position={[0, 2.5, -55]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#060404" roughness={0.9} />
      </mesh>

      {/* Starfield sparkles */}
      <Sparkles 
        count={300} 
        scale={[10, 6, 18]} 
        position={[0, 2, -44]} 
        speed={0.2} 
        opacity={0.6} 
        size={1.5} 
        color="#ffaa00" 
      />

      {candlePositions.map((pos, i) => <Candle key={i} position={pos} />)}

      {/* Gifts on both sides */}
      <Gifts />
      
      {/* The Birthday Cake! Center stage (behind the curtain) */}
      <Cake position={[0, 0.4, -44]} /> 

      {/* Curtain IN FRONT of the cake — opens to reveal the cake */}
      <Curtain position={[0, 2.5, -40]} />
      
      {/* Neon Sign "Happy Birthday" above the cake, backdrop behind cake */}
      <group position={[0, 3.5, -49]}>
        {/* Glow layer */}
        <Text
          fontSize={0.8}
          anchorX="center"
          anchorY="middle"
        >
          Happy Birthday
          <meshBasicMaterial color="#ff6b9a" transparent opacity={0.8} toneMapped={false} />
        </Text>
        {/* Crisp white core */}
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

      <EasterEgg />
    </group>
  )
}
