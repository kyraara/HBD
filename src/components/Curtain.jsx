import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

/**
 * Creates a canvas-based SVG curtain texture with rich folds and details.
 * This avoids loading an external image and keeps things lightweight.
 */
function createCurtainTexture(width = 512, height = 512, isLeft = true) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Base rich crimson gradient
  const baseGrad = ctx.createLinearGradient(0, 0, width, 0)
  baseGrad.addColorStop(0, '#6b0f0f')
  baseGrad.addColorStop(0.15, '#a31a1a')
  baseGrad.addColorStop(0.3, '#8b1515')
  baseGrad.addColorStop(0.5, '#c42020')
  baseGrad.addColorStop(0.65, '#902020')
  baseGrad.addColorStop(0.8, '#a31a1a')
  baseGrad.addColorStop(1, '#6b0f0f')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Vertical fold lines (lighter and darker stripes to simulate folds)
  const foldCount = 8
  for (let i = 0; i < foldCount; i++) {
    const x = (width / foldCount) * i
    const foldWidth = width / foldCount

    // Light edge of fold (highlight)
    const highlightGrad = ctx.createLinearGradient(x, 0, x + foldWidth, 0)
    highlightGrad.addColorStop(0, 'rgba(255,180,180,0.12)')
    highlightGrad.addColorStop(0.3, 'rgba(255,220,220,0.08)')
    highlightGrad.addColorStop(0.5, 'rgba(0,0,0,0)')
    highlightGrad.addColorStop(0.7, 'rgba(0,0,0,0.08)')
    highlightGrad.addColorStop(1, 'rgba(0,0,0,0.15)')
    ctx.fillStyle = highlightGrad
    ctx.fillRect(x, 0, foldWidth, height)
  }

  // Subtle vertical lines for fabric texture
  ctx.strokeStyle = 'rgba(0,0,0,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < width; x += 4) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Horizontal weave lines
  ctx.strokeStyle = 'rgba(255,255,255,0.02)'
  for (let y = 0; y < height; y += 6) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Bottom hem shadow
  const hemGrad = ctx.createLinearGradient(0, height - 40, 0, height)
  hemGrad.addColorStop(0, 'rgba(0,0,0,0)')
  hemGrad.addColorStop(1, 'rgba(0,0,0,0.3)')
  ctx.fillStyle = hemGrad
  ctx.fillRect(0, height - 40, width, 40)

  // Gold trim at bottom
  ctx.fillStyle = '#d4af37'
  ctx.fillRect(0, height - 8, width, 4)
  ctx.fillStyle = 'rgba(212,175,55,0.5)'
  ctx.fillRect(0, height - 14, width, 3)

  // Gold trim at top
  ctx.fillStyle = '#d4af37'
  ctx.fillRect(0, 2, width, 4)
  ctx.fillStyle = 'rgba(212,175,55,0.5)'
  ctx.fillRect(0, 8, width, 3)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

/**
 * Creates a canvas-based SVG valance (poni tirai) texture.
 */
function createValanceTexture(width = 1024, height = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Deep maroon/crimson base
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
  baseGrad.addColorStop(0, '#5a0c0c')
  baseGrad.addColorStop(0.4, '#8b1515')
  baseGrad.addColorStop(1, '#6b0f0f')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Scalloped bottom edge (swag effect)
  const swagCount = 5
  const swagWidth = width / swagCount
  ctx.fillStyle = '#5a0c0c'
  for (let i = 0; i < swagCount; i++) {
    const cx = swagWidth * i + swagWidth / 2
    ctx.beginPath()
    ctx.moveTo(swagWidth * i, height * 0.5)
    ctx.quadraticCurveTo(cx, height * 0.95, swagWidth * (i + 1), height * 0.5)
    ctx.lineTo(swagWidth * (i + 1), height)
    ctx.lineTo(swagWidth * i, height)
    ctx.closePath()

    const swagGrad = ctx.createLinearGradient(0, height * 0.5, 0, height)
    swagGrad.addColorStop(0, 'rgba(139,21,21,0.6)')
    swagGrad.addColorStop(1, 'rgba(60,8,8,0.9)')
    ctx.fillStyle = swagGrad
    ctx.fill()
  }

  // Gold fringe at bottom
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 3
  for (let x = 0; x < width; x += 8) {
    ctx.beginPath()
    ctx.moveTo(x, height - 8)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Gold trim line
  ctx.fillStyle = '#d4af37'
  ctx.fillRect(0, 0, width, 5)
  ctx.fillRect(0, height * 0.48, width, 3)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

export default function Curtain({ position = [0, 2.5, -40], zDepth = 0.15 }) {
  const leftCurtainRef = useRef()
  const rightCurtainRef = useRef()
  const leftTieRef = useRef()
  const rightTieRef = useRef()
  const { currentWaypoint, maxWaypoints, isSecretRoomUnlocked, controlMode } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const isGuidedOpen = currentWaypoint === maxWaypoints && isSecretRoomUnlocked

  // Generate SVG-based canvas textures (memoized so they're created once)
  const leftTexture = useMemo(() => createCurtainTexture(512, 512, true), [])
  const rightTexture = useMemo(() => createCurtainTexture(512, 512, false), [])
  const valanceTexture = useMemo(() => createValanceTexture(1024, 256), [])

  useFrame((state, delta) => {
    // Determine if curtain should open
    let shouldOpen = isGuidedOpen
    if (controlMode === 'manual') {
      shouldOpen = state.camera.position.z < position[2] + 3
    }

    if (shouldOpen !== isOpen) {
      setIsOpen(shouldOpen)
    }

    const speed = delta * 1.8

    // Left curtain animation
    if (leftCurtainRef.current) {
      const targetScaleX = shouldOpen ? 0.12 : 1
      const targetPosX = shouldOpen ? -4.8 : -2.6
      leftCurtainRef.current.scale.x = THREE.MathUtils.lerp(leftCurtainRef.current.scale.x, targetScaleX, speed)
      leftCurtainRef.current.position.x = THREE.MathUtils.lerp(leftCurtainRef.current.position.x, targetPosX, speed)
    }

    // Right curtain animation
    if (rightCurtainRef.current) {
      const targetScaleX = shouldOpen ? 0.12 : 1
      const targetPosX = shouldOpen ? 4.8 : 2.6
      rightCurtainRef.current.scale.x = THREE.MathUtils.lerp(rightCurtainRef.current.scale.x, targetScaleX, speed)
      rightCurtainRef.current.position.x = THREE.MathUtils.lerp(rightCurtainRef.current.position.x, targetPosX, speed)
    }

    // Tie-back ropes (move with curtain)
    if (leftTieRef.current) {
      const targetX = shouldOpen ? -4.6 : -2.6
      leftTieRef.current.position.x = THREE.MathUtils.lerp(leftTieRef.current.position.x, targetX, speed)
      leftTieRef.current.visible = shouldOpen
    }
    if (rightTieRef.current) {
      const targetX = shouldOpen ? 4.6 : 2.6
      rightTieRef.current.position.x = THREE.MathUtils.lerp(rightTieRef.current.position.x, targetX, speed)
      rightTieRef.current.visible = shouldOpen
    }
  })

  return (
    <group position={position}>
      {/* ===== Left Curtain Panel ===== */}
      <mesh ref={leftCurtainRef} position={[-2.6, 0, 0]} castShadow>
        <boxGeometry args={[5.2, 5, zDepth]} />
        <meshStandardMaterial
          map={leftTexture}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ===== Right Curtain Panel ===== */}
      <mesh ref={rightCurtainRef} position={[2.6, 0, 0]} castShadow>
        <boxGeometry args={[5.2, 5, zDepth]} />
        <meshStandardMaterial
          map={rightTexture}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ===== Gold Tie-back Ropes (visible when open) ===== */}
      <group ref={leftTieRef} position={[-2.6, -0.3, 0.1]} visible={false}>
        {/* Rope */}
        <mesh>
          <torusGeometry args={[0.25, 0.03, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Tassel */}
        <mesh position={[0.25, -0.1, 0]}>
          <coneGeometry args={[0.06, 0.2, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.25, -0.1, 0]}>
          <coneGeometry args={[0.06, 0.2, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      <group ref={rightTieRef} position={[2.6, -0.3, 0.1]} visible={false}>
        <mesh>
          <torusGeometry args={[0.25, 0.03, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.25, -0.1, 0]}>
          <coneGeometry args={[0.06, 0.2, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.25, -0.1, 0]}>
          <coneGeometry args={[0.06, 0.2, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* ===== Curtain Rod ===== */}
      <mesh position={[0, 2.3, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 10.5, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Rod Finials (decorative ends) */}
      <mesh position={[-5.3, 2.3, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[5.3, 2.3, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* ===== Top Valance (Poni Tirai) ===== */}
      <mesh position={[0, 2.65, 0.12]} castShadow>
        <boxGeometry args={[10.6, 0.7, zDepth + 0.08]} />
        <meshStandardMaterial
          map={valanceTexture}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
