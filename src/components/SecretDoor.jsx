import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

/**
 * Creates a canvas-based SVG texture for the wall partitions.
 * Renders a realistic wall with subtle plaster/stucco texture.
 */
function createWallTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Warm off-white plaster base
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
  baseGrad.addColorStop(0, '#f0ead6')
  baseGrad.addColorStop(0.3, '#ebe5d9')
  baseGrad.addColorStop(0.7, '#e6dfd0')
  baseGrad.addColorStop(1, '#ddd7c6')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Subtle plaster texture noise
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 2 + 0.5
    const alpha = Math.random() * 0.06
    ctx.fillStyle = Math.random() > 0.5
      ? `rgba(0,0,0,${alpha})`
      : `rgba(255,255,255,${alpha})`
    ctx.fillRect(x, y, size, size)
  }

  // Crown molding pattern at top
  const moldingGrad = ctx.createLinearGradient(0, 0, 0, 20)
  moldingGrad.addColorStop(0, '#d4cbb8')
  moldingGrad.addColorStop(0.5, '#ebe5d9')
  moldingGrad.addColorStop(1, '#c8bfab')
  ctx.fillStyle = moldingGrad
  ctx.fillRect(0, 0, width, 12)

  // Subtle shadow line below molding
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(0, 12, width, 3)

  // Wainscoting panel at bottom
  const panelHeight = height * 0.25
  const panelY = height - panelHeight
  ctx.fillStyle = 'rgba(0,0,0,0.03)'
  ctx.fillRect(0, panelY, width, panelHeight)

  // Panel trim line
  ctx.strokeStyle = 'rgba(180,170,150,0.5)'
  ctx.lineWidth = 2
  ctx.strokeRect(20, panelY + 10, width - 40, panelHeight - 20)

  // Chair rail
  ctx.fillStyle = '#c8bfab'
  ctx.fillRect(0, panelY - 4, width, 6)
  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  ctx.fillRect(0, panelY + 2, width, 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

/**
 * Creates a canvas-based SVG texture for the door.
 * Rich dark wood with panel details.
 */
function createDoorTexture(width = 512, height = 768) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Dark wood base
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height)
  baseGrad.addColorStop(0, '#2e2820')
  baseGrad.addColorStop(0.3, '#332d25')
  baseGrad.addColorStop(0.5, '#2a251e')
  baseGrad.addColorStop(0.7, '#332d25')
  baseGrad.addColorStop(1, '#252018')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Wood grain lines
  ctx.strokeStyle = 'rgba(255,220,180,0.04)'
  ctx.lineWidth = 1
  for (let y = 0; y < height; y += 3) {
    ctx.beginPath()
    ctx.moveTo(0, y + Math.sin(y * 0.05) * 2)
    ctx.lineTo(width, y + Math.sin(y * 0.05 + 1) * 2)
    ctx.stroke()
  }

  // Door panels (two raised panels)
  const drawPanel = (px, py, pw, ph) => {
    // Panel recess
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(px, py, pw, ph)

    // Inner panel (slightly lighter)
    const panelGrad = ctx.createLinearGradient(px, py, px, py + ph)
    panelGrad.addColorStop(0, '#3a3428')
    panelGrad.addColorStop(0.5, '#363020')
    panelGrad.addColorStop(1, '#302a1e')
    ctx.fillStyle = panelGrad
    ctx.fillRect(px + 8, py + 8, pw - 16, ph - 16)

    // Beveled edges
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(px + 4, py + ph - 4)
    ctx.lineTo(px + 4, py + 4)
    ctx.lineTo(px + pw - 4, py + 4)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    ctx.beginPath()
    ctx.moveTo(px + pw - 4, py + 4)
    ctx.lineTo(px + pw - 4, py + ph - 4)
    ctx.lineTo(px + 4, py + ph - 4)
    ctx.stroke()
  }

  const panelMargin = 50
  const panelWidth = width - panelMargin * 2
  const gap = 30

  // Top panel
  drawPanel(panelMargin, 40, panelWidth, height * 0.38)
  // Bottom panel
  drawPanel(panelMargin, height * 0.38 + 40 + gap, panelWidth, height * 0.38)

  // Subtle "keyhole" area (decorative circle)
  const khX = width * 0.2
  const khY = height * 0.52
  ctx.beginPath()
  ctx.arc(khX, khY, 10, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1610'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(khX, khY, 12, 0, Math.PI * 2)
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 2
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

/**
 * Creates a canvas-based SVG texture for the door frame trim.
 */
function createFrameTexture(width = 64, height = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // Dark wood frame
  const baseGrad = ctx.createLinearGradient(0, 0, width, 0)
  baseGrad.addColorStop(0, '#2a1f15')
  baseGrad.addColorStop(0.3, '#3a3024')
  baseGrad.addColorStop(0.7, '#3a3024')
  baseGrad.addColorStop(1, '#2a1f15')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, width, height)

  // Gold inlay line
  ctx.fillStyle = 'rgba(212,175,55,0.3)'
  ctx.fillRect(width * 0.3, 0, 2, height)
  ctx.fillRect(width * 0.7, 0, 2, height)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export default function SecretDoor({ position }) {
  const isUnlocked = useStore(state => state.isSecretRoomUnlocked)
  const [hovered, setHovered] = React.useState(false)
  const doorRef = useRef()
  const glowRef = useRef()

  // Memoize textures
  const wallTexture = useMemo(() => createWallTexture(), [])
  const doorTexture = useMemo(() => createDoorTexture(), [])
  const frameTexture = useMemo(() => createFrameTexture(), [])
  const doorHoverTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 768
    const ctx = canvas.getContext('2d')

    // Slightly lighter door for hover
    const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    baseGrad.addColorStop(0, '#3a3430')
    baseGrad.addColorStop(0.5, '#45403a')
    baseGrad.addColorStop(1, '#3a3430')
    ctx.fillStyle = baseGrad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Same wood grain
    ctx.strokeStyle = 'rgba(255,220,180,0.05)'
    ctx.lineWidth = 1
    for (let y = 0; y < canvas.height; y += 3) {
      ctx.beginPath()
      ctx.moveTo(0, y + Math.sin(y * 0.05) * 2)
      ctx.lineTo(canvas.width, y + Math.sin(y * 0.05 + 1) * 2)
      ctx.stroke()
    }

    // Panels
    const panelMargin = 50
    const panelWidth = canvas.width - panelMargin * 2
    const gap = 30

    const drawPanel = (px, py, pw, ph) => {
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(px, py, pw, ph)
      const panelGrad = ctx.createLinearGradient(px, py, px, py + ph)
      panelGrad.addColorStop(0, '#4a4438')
      panelGrad.addColorStop(1, '#403a2e')
      ctx.fillStyle = panelGrad
      ctx.fillRect(px + 8, py + 8, pw - 16, ph - 16)
    }

    drawPanel(panelMargin, 40, panelWidth, canvas.height * 0.38)
    drawPanel(panelMargin, canvas.height * 0.38 + 40 + gap, panelWidth, canvas.height * 0.38)

    // Subtle glow border
    ctx.strokeStyle = 'rgba(212,175,55,0.25)'
    ctx.lineWidth = 4
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6)

    return new THREE.CanvasTexture(canvas)
  }, [])

  const handleClick = (e) => {
    e.stopPropagation()
    const state = useStore.getState()
    if (!isUnlocked && state.controlMode === 'manual') {
      state.setShowEKG(true)
    }
  }

  // Animation for the door sliding to the left behind the wall
  useFrame((state, delta) => {
    if (doorRef.current) {
      const targetX = isUnlocked ? 4.5 : 0
      doorRef.current.position.x = THREE.MathUtils.lerp(doorRef.current.position.x, targetX, 2 * delta)
    }

    if (glowRef.current && isUnlocked) {
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, 3, 2 * delta)
    }
  })

  return (
    <group position={position}>
      {/* ===== Static Wall Partitions with SVG texture ===== */}

      {/* Left wall partition */}
      <mesh position={[-3.75, 0, 0]} receiveShadow>
        <planeGeometry args={[2.5, 5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>

      {/* Right wall partition */}
      <mesh position={[3.75, 0, 0]} receiveShadow>
        <planeGeometry args={[2.5, 5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>

      {/* Top partition above the door (lintel) */}
      <mesh position={[0, 1.8, 0]} receiveShadow>
        <planeGeometry args={[5, 1.4]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>

      {/* ===== Door Frame Trim with SVG texture ===== */}
      {/* Left frame */}
      <mesh position={[-2.52, -0.3, 0.01]}>
        <boxGeometry args={[0.1, 3.8, 0.04]} />
        <meshStandardMaterial map={frameTexture} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Right frame */}
      <mesh position={[2.52, -0.3, 0.01]}>
        <boxGeometry args={[0.1, 3.8, 0.04]} />
        <meshStandardMaterial map={frameTexture} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Top frame */}
      <mesh position={[0, 1.12, 0.01]}>
        <boxGeometry args={[5.14, 0.1, 0.04]} />
        <meshStandardMaterial map={frameTexture} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Decorative arch light above door */}
      <pointLight position={[0, 1.5, 0.3]} intensity={0.4} distance={4} color="#ffeedd" />

      {/* ===== The Interactive Sliding Door with SVG texture ===== */}
      <mesh
        ref={doorRef}
        position={[0, -0.6, 0.02]}
        receiveShadow
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[5, 3.6]} />
        <meshStandardMaterial
          map={hovered ? doorHoverTexture : doorTexture}
          roughness={0.6}
          metalness={0.15}
        />

        {/* Door handle (gold bar) */}
        <mesh position={[-2, 0, 0.04]}>
          <boxGeometry args={[0.08, 0.7, 0.06]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Door handle base plate */}
        <mesh position={[-2, 0, 0.02]}>
          <boxGeometry args={[0.2, 0.9, 0.02]} />
          <meshStandardMaterial color="#b8960e" metalness={0.8} roughness={0.2} />
        </mesh>
      </mesh>

      {/* Warm light leak from behind the door when opened */}
      <pointLight ref={glowRef} position={[0, 0, -1.5]} intensity={0} distance={15} color="#ffeaa6" />
    </group>
  )
}
