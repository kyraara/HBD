import React, { useRef } from 'react'
import { Sparkles, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import Cake from './Cake'
import Gifts from './Gifts'
import Curtain from './Curtain'
import EasterEgg from './EasterEgg'
import { useStore } from '../store'
import * as THREE from 'three'

function Candle({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.3} />
      </mesh>
      <pointLight position={[0, 0.1, 0]} intensity={0.5} distance={5} color="#ffaa33" />
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffeaa7" toneMapped={false} />
      </mesh>
    </group>
  )
}

/**
 * Animated neon sign with flicker effect
 */
function NeonSign({ position }) {
  const glowRef = useRef()
  const coreRef = useRef()
  const flickerRef = useRef(1)

  useFrame(({ clock }, delta) => {
    // Neon flicker effect
    const t = clock.elapsedTime
    const flicker = Math.sin(t * 30) > 0.95 ? 0.3 : 1 // occasional flicker
    const breathe = 0.8 + Math.sin(t * 1.5) * 0.2 // slow breathe
    flickerRef.current = THREE.MathUtils.lerp(flickerRef.current, flicker * breathe, delta * 10)

    if (glowRef.current) {
      glowRef.current.fillOpacity = flickerRef.current * 0.7
    }
    if (coreRef.current) {
      coreRef.current.fillOpacity = flickerRef.current
    }
  })

  return (
    <group position={position}>
      {/* Glow layer */}
      <Text
        ref={glowRef}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {`console.log("Happy Birthday!")`}
        <meshBasicMaterial color="#ffeaa7" transparent opacity={0.7} toneMapped={false} />
      </Text>
      {/* Crisp core */}
      <Text
        ref={coreRef}
        position={[0, 0, 0.02]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {`console.log("Happy Birthday!")`}
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </Text>
      {/* Neon glow light */}
      <pointLight position={[0, 0, 0.5]} intensity={1.5} distance={6} color="#ffeaa7" />
    </group>
  )
}

export default function SecretRoom() {
  const isUnlocked = useStore(s => s.isSecretRoomUnlocked)
  
  if (!isUnlocked) return null

  const candlePositions = [
    [-3, 0.4, -39], [3, 0.4, -39],
    [-4, 0.4, -43], [4, 0.4, -43],
    [-2, 0.4, -46], [2, 0.4, -46],
    [-3.5, 0.4, -38], [3.5, 0.4, -38]
  ]

  return (
    <group>
      {/* Dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -45]} receiveShadow>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color="#111116" roughness={0.9} />
      </mesh>

      {/* Dark ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, -45]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color="#0d0d12" roughness={1} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-5, 2.5, -45]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#13131a" roughness={0.9} />
      </mesh>
      <mesh position={[5, 2.5, -45]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#13131a" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -55]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#0f0f14" roughness={0.9} />
      </mesh>

      {/* LED strip on floor edges */}
      <mesh position={[-4.95, 0.01, -45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 20]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.15} toneMapped={false} />
      </mesh>
      <mesh position={[4.95, 0.01, -45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 20]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.15} toneMapped={false} />
      </mesh>

      {/* Green sparkles */}
      <Sparkles 
        count={300} 
        scale={[10, 6, 18]} 
        position={[0, 2, -44]} 
        speed={0.2} 
        opacity={0.5} 
        size={1.5} 
        color="#ffeaa7" 
      />

      {candlePositions.map((pos, i) => <Candle key={i} position={pos} />)}

      {/* Gifts */}
      <Gifts />
      
      {/* Cake */}
      <Cake position={[0, 0.4, -44]} /> 

      {/* Curtain IN FRONT of the cake */}
      <Curtain position={[0, 2.5, -40]} />
      
      {/* Animated Neon Sign */}
      <NeonSign position={[0, 3.5, -49]} />

      <EasterEgg />
    </group>
  )
}
