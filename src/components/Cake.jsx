import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

function Confetti({ count = 60 }) {
  const meshRef = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [(Math.random() - 0.5) * 3, Math.random() * 2 + 1, (Math.random() - 0.5) * 3],
        speed: 0.3 + Math.random() * 0.5,
        color: ['#ff90b3', '#ff6b9a', '#ffd700', '#ffb8d2', '#ffffff', '#e83e8c'][Math.floor(Math.random() * 6)]
      })
    }
    return temp
  }, [count])

  return (
    <group>
      {particles.map((p, i) => (
        <ConfettiPiece key={i} {...p} />
      ))}
    </group>
  )
}

function ConfettiPiece({ position, speed, rotationSpeed, color }) {
  const ref = useRef()
  const initialY = position[1]

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = initialY - (clock.elapsedTime * speed) % 4
      ref.current.rotation.x = clock.elapsedTime * rotationSpeed
      ref.current.rotation.z = clock.elapsedTime * rotationSpeed * 0.5
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.08, 0.08]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
  )
}

export default function Cake({ position }) {
  const { candleBlown, currentWaypoint, maxWaypoints, isUnlocked, controlMode } = useStore()
  const flameRef = useRef()
  const outerFlameRef = useRef()
  const spotLightRef = useRef()

  const isGuidedAtCake = currentWaypoint === maxWaypoints && isUnlocked

  useFrame(({ clock, camera }, delta) => {
    let isAtCake = isGuidedAtCake
    if (controlMode === 'manual') {
      isAtCake = camera.position.z < -27
    }

    if (spotLightRef.current) {
      const targetIntensity = isAtCake ? 8 : 2
      spotLightRef.current.intensity = THREE.MathUtils.lerp(spotLightRef.current.intensity, targetIntensity, delta * 2)
    }

    if (!candleBlown) {
      if (flameRef.current) {
        flameRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 12) * 0.15
        flameRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 18) * 0.12
        flameRef.current.position.x = Math.sin(clock.elapsedTime * 8) * 0.01
      }
      if (outerFlameRef.current) {
        outerFlameRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 10) * 0.2
        outerFlameRef.current.scale.y = 1 + Math.cos(clock.elapsedTime * 14) * 0.15
      }
    }
  })

  return (
    <group position={position}>
      {/* Spotlight on the cake */}
      <spotLight ref={spotLightRef} position={[0, 4, 2]} angle={0.5} penumbra={0.8} intensity={2} distance={8} castShadow />

      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.4, 0.6, 32]} />
        <meshStandardMaterial color="#4a3525" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Tablecloth edge */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.65, 1.65, 0.05, 32]} />
        <meshStandardMaterial color="#d4af37" roughness={0.8} />
      </mesh>

      {/* Cake Bottom Layer */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.4, 32]} />
        <meshStandardMaterial color="#f7e3c9" roughness={0.5} />
      </mesh>

      {/* Cake Top Layer */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.85, 0.3, 32]} />
        <meshStandardMaterial color="#fce8d5" roughness={0.4} />
      </mesh>

      {/* Icing Drip */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.04, 32]} />
        <meshStandardMaterial color="#ff90b3" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Gold trim */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.12, 1.12, 0.02, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Candle */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 12]} />
        <meshStandardMaterial color="#faf5e4" roughness={0.3} />
      </mesh>
      {/* Candle stripe */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 12]} />
        <meshStandardMaterial color="#ff90b3" roughness={0.3} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.06, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Flame */}
      {!candleBlown && (
        <group position={[0, 1.12, 0]}>
          <pointLight color="#ffaa33" intensity={1.5} distance={4} decay={2} />
          {/* Outer glow */}
          <mesh ref={outerFlameRef}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#ff8800" transparent opacity={0.35} />
          </mesh>
          {/* Inner flame */}
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.9} />
          </mesh>
        </group>
      )}
      
      {/* Confetti after blow! */}
      {candleBlown && <Confetti count={50} />}
    </group>
  )
}
