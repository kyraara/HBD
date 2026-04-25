import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

/**
 * Creates a rich velvet curtain texture with warm tones
 */
function createCurtainTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Deep burgundy/maroon velvet base
  const baseGrad = ctx.createLinearGradient(0, 0, width, 0)
  baseGrad.addColorStop(0, '#2a0a0e')
  baseGrad.addColorStop(0.15, '#3d1018')
  baseGrad.addColorStop(0.3, '#4a1520')
  baseGrad.addColorStop(0.5, '#521822')
  baseGrad.addColorStop(0.65, '#4a1520')
  baseGrad.addColorStop(0.8, '#3d1018')
  baseGrad.addColorStop(1, '#2a0a0e')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Velvet folds - vertical pleats with light/shadow
  const foldCount = 8
  for (let i = 0; i < foldCount; i++) {
    const x = (width / foldCount) * i
    const foldWidth = width / foldCount

    const highlightGrad = ctx.createLinearGradient(x, 0, x + foldWidth, 0)
    highlightGrad.addColorStop(0, 'rgba(180,80,80,0.08)')
    highlightGrad.addColorStop(0.25, 'rgba(220,160,120,0.06)')
    highlightGrad.addColorStop(0.4, 'rgba(255,200,150,0.04)')
    highlightGrad.addColorStop(0.5, 'rgba(0,0,0,0)')
    highlightGrad.addColorStop(0.7, 'rgba(0,0,0,0.08)')
    highlightGrad.addColorStop(1, 'rgba(0,0,0,0.15)')
    ctx.fillStyle = highlightGrad
    ctx.fillRect(x, 0, foldWidth, height)
  }

  // Subtle vertical thread lines for fabric texture
  ctx.strokeStyle = 'rgba(180,100,100,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < width; x += 6) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Horizontal weave lines
  ctx.strokeStyle = 'rgba(160,80,80,0.03)'
  for (let y = 0; y < height; y += 8) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Bottom shadow gradient (heavier at base for gravity effect)
  const bottomGrad = ctx.createLinearGradient(0, height * 0.65, 0, height)
  bottomGrad.addColorStop(0, 'rgba(0,0,0,0)')
  bottomGrad.addColorStop(0.5, 'rgba(15,5,5,0.2)')
  bottomGrad.addColorStop(1, 'rgba(10,2,2,0.5)')
  ctx.fillStyle = bottomGrad
  ctx.fillRect(0, height * 0.65, width, height * 0.35)

  // Top shine (light catching the top of the curtain)
  const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.15)
  topGrad.addColorStop(0, 'rgba(255,200,150,0.1)')
  topGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, width, height * 0.15)

  // Golden shimmer accents scattered across
  for (let i = 0; i < 30; i++) {
    const gx = Math.random() * width
    const gy = Math.random() * height
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 8)
    grad.addColorStop(0, 'rgba(212,175,55,0.05)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(gx - 8, gy - 8, 16, 16)
  }

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function createValanceTexture(width = 512, height = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Rich dark red with golden accents - pelmet
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
  baseGrad.addColorStop(0, '#3d1018')
  baseGrad.addColorStop(0.4, '#4a1520')
  baseGrad.addColorStop(0.6, '#3d1018')
  baseGrad.addColorStop(1, '#2a0a0e')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Golden trim at bottom
  const goldGrad = ctx.createLinearGradient(0, height - 8, 0, height)
  goldGrad.addColorStop(0, 'rgba(212,175,55,0.4)')
  goldGrad.addColorStop(0.5, 'rgba(255,215,100,0.3)')
  goldGrad.addColorStop(1, 'rgba(180,140,40,0.2)')
  ctx.fillStyle = goldGrad
  ctx.fillRect(0, height - 8, width, 8)

  // Golden trim at top
  ctx.fillStyle = 'rgba(212,175,55,0.2)'
  ctx.fillRect(0, 0, width, 3)

  // Decorative gold pattern — small scallop shapes
  ctx.fillStyle = 'rgba(212,175,55,0.08)'
  for (let x = 0; x < width; x += 32) {
    ctx.beginPath()
    ctx.arc(x + 16, height * 0.5, 12, 0, Math.PI, false)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

/**
 * Smooth ease-in-out function for more natural animation
 */
function smoothStep(current, target, speed, delta) {
  const diff = target - current
  // Ease-out cubic for smooth deceleration
  const t = 1 - Math.pow(1 - Math.min(speed * delta, 1), 3)
  return current + diff * t
}

export default function Curtain({ position = [0, 2.5, -40] }) {
  const { isSecretRoomUnlocked, controlMode, currentWaypoint, maxWaypoints, setCurtainOpen } = useStore()
  const leftRef = useRef()
  const rightRef = useRef()
  const leftMeshRef = useRef()
  const rightMeshRef = useRef()
  const [isOpen, setIsOpen] = useState(false)

  // Sway animation state
  const swayRef = useRef({ active: false, time: 0, intensity: 0 })
  // Track animation progress for gathering effect
  const animProgress = useRef(0)

  const leftTexture = useMemo(() => createCurtainTexture(512, 512), [])
  const rightTexture = useMemo(() => createCurtainTexture(512, 512), [])
  const valanceTexture = useMemo(() => createValanceTexture(), [])

  // Hysteresis thresholds — curtain is at z=-40
  const OPEN_THRESHOLD_Z = -34   // Opens when camera approaches (6 units before curtain)
  const CLOSE_THRESHOLD_Z = -30  // Closes when camera retreats far enough

  useFrame(({ camera, clock }, delta) => {
    if (!isSecretRoomUnlocked) return

    let shouldOpen = isOpen // Keep current state by default (hysteresis)

    if (controlMode === 'manual') {
      // Hysteresis: different thresholds for open vs close
      if (!isOpen && camera.position.z < OPEN_THRESHOLD_Z) {
        shouldOpen = true
      } else if (isOpen && camera.position.z > CLOSE_THRESHOLD_Z) {
        shouldOpen = false
      }
    } else {
      // Guided mode: open at last waypoint, close when going back
      if (!isOpen && currentWaypoint >= maxWaypoints - 1) {
        shouldOpen = true
      } else if (isOpen && currentWaypoint < maxWaypoints - 2) {
        shouldOpen = false
      }
    }

    // State change — trigger sway animation
    if (shouldOpen !== isOpen) {
      setIsOpen(shouldOpen)
      setCurtainOpen(shouldOpen)
      // Trigger fabric sway on state change
      swayRef.current = { active: true, time: 0, intensity: 1.0 }
    }

    // Update animation progress (0 = closed, 1 = fully open)
    const targetProgress = isOpen ? 1 : 0
    animProgress.current = smoothStep(animProgress.current, targetProgress, 2.5, delta)

    // Sway animation (damped oscillation after open/close)
    let swayOffset = 0
    if (swayRef.current.active) {
      swayRef.current.time += delta
      const t = swayRef.current.time
      // Damped sine wave — decays over ~2 seconds
      swayRef.current.intensity = Math.max(0, 1 - t * 0.8)
      swayOffset = Math.sin(t * 8) * 0.15 * swayRef.current.intensity
      if (swayRef.current.intensity <= 0.01) {
        swayRef.current.active = false
        swayOffset = 0
      }
    }

    if (leftRef.current && rightRef.current) {
      const p = animProgress.current

      // Position: slide out with easing
      const targetX = p * 5.5
      leftRef.current.position.x = -targetX + swayOffset
      rightRef.current.position.x = targetX - swayOffset

      // Gathering effect: panels narrow (scaleX shrinks) when open,
      // simulating fabric bunching at the sides
      const gatherScale = 1 - p * 0.45 // From 1.0 (full) to 0.55 (gathered)
      if (leftMeshRef.current) {
        leftMeshRef.current.scale.x = gatherScale
      }
      if (rightMeshRef.current) {
        rightMeshRef.current.scale.x = gatherScale
      }
    }
  })

  return (
    <group position={position}>
      {/* Curtain Rod — ornate golden rod */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 11, 16]} />
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rod decorative finials */}
      <mesh position={[-5.5, 2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.1} emissive="#3a2a00" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[5.5, 2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.1} emissive="#3a2a00" emissiveIntensity={0.3} />
      </mesh>

      {/* Valance (pelmet) — decorative top border */}
      <mesh position={[0, 1.7, 0.05]}>
        <planeGeometry args={[11, 0.6]} />
        <meshStandardMaterial map={valanceTexture} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Left Curtain Panel */}
      <group ref={leftRef}>
        <mesh ref={leftMeshRef} position={[-2.5, -0.5, 0]} castShadow receiveShadow>
          <planeGeometry args={[5, 4.5]} />
          <meshStandardMaterial 
            map={leftTexture} 
            roughness={0.85} 
            metalness={0.05}
            side={THREE.DoubleSide}
            color="#8b2030"
          />
        </mesh>
        {/* Curtain tassel left */}
        <mesh position={[-0.1, -2.5, 0.05]}>
          <cylinderGeometry args={[0.04, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      {/* Right Curtain Panel */}
      <group ref={rightRef}>
        <mesh ref={rightMeshRef} position={[2.5, -0.5, 0]} castShadow receiveShadow>
          <planeGeometry args={[5, 4.5]} />
          <meshStandardMaterial 
            map={rightTexture} 
            roughness={0.85} 
            metalness={0.05}
            side={THREE.DoubleSide}
            color="#8b2030"
          />
        </mesh>
        {/* Curtain tassel right */}
        <mesh position={[0.1, -2.5, 0.05]}>
          <cylinderGeometry args={[0.04, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      {/* Warm ambient glow for curtain area */}
      <pointLight position={[0, 1, 0.5]} intensity={0.3} distance={5} color="#ffcc88" />
    </group>
  )
}
