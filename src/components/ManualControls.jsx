import { useRef, useEffect, useCallback, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'
import { playFootstep, playFootstepEcho } from '../utils/sfx'

const MOVE_SPEED = 3
const LOOK_SPEED = 0.003

export default function ManualControls({ started }) {
  const { controlMode, isMuted, isSecretRoomUnlocked } = useStore()
  
  const ROOM_BOUNDS = { minX: -4.5, maxX: 4.5, minZ: isSecretRoomUnlocked ? -53 : -34, maxZ: 1 }

  const { camera, gl } = useThree()

  const keys = useRef({ w: false, a: false, s: false, d: false })
  const activePointerId = useRef(null)
  const prevPointer = useRef({ x: 0, y: 0 })
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const joystickInput = useRef({ x: 0, y: 0 }) // For virtual joystick
  const footstepTimer = useRef(0.45) // Starts high to trigger instantly on first step

  // WASD keyboard handlers
  useEffect(() => {
    if (controlMode !== 'manual' || !started) return

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (keys.current.hasOwnProperty(key)) keys.current[key] = true
    }
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (keys.current.hasOwnProperty(key)) keys.current[key] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      keys.current = { w: false, a: false, s: false, d: false }
    }
  }, [controlMode, started])

  // Touch/mouse drag to look — works like mobile FPS:
  // Swipe anywhere on screen (except UI buttons/joystick) to rotate camera
  useEffect(() => {
    if (controlMode !== 'manual' || !started) return

    // Check if the touch target is a UI element we should ignore
    const isUIElement = (el) => {
      while (el) {
        if (el.classList && (
          el.classList.contains('ui-interactive') ||
          el.classList.contains('joystick-base') ||
          el.classList.contains('joystick-stick') ||
          el.classList.contains('mute-btn') ||
          el.classList.contains('mode-toggle') ||
          el.tagName === 'BUTTON'
        )) return true
        el = el.parentElement
      }
      return false
    }

    const onPointerDown = (e) => {
      // Skip if touching a UI button or the joystick
      if (isUIElement(e.target)) return
      if (activePointerId.current !== null) return
      activePointerId.current = e.pointerId
      prevPointer.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e) => {
      if (activePointerId.current !== e.pointerId) return
      const dx = e.clientX - prevPointer.current.x
      const dy = e.clientY - prevPointer.current.y
      prevPointer.current = { x: e.clientX, y: e.clientY }

      // Higher sensitivity on mobile for comfortable swiping
      const isMobile = window.innerWidth < 768 || window.innerWidth < window.innerHeight
      const activeLookSpeed = isMobile ? LOOK_SPEED * 3 : LOOK_SPEED

      euler.current.setFromQuaternion(camera.quaternion)
      euler.current.y -= dx * activeLookSpeed
      euler.current.x -= dy * activeLookSpeed
      euler.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.current.x))
      camera.quaternion.setFromEuler(euler.current)
    }

    const onPointerUp = (e) => {
      if (activePointerId.current === e.pointerId) {
        activePointerId.current = null
      }
    }

    // Listen on document so ANY screen swipe works (not just on the canvas)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerUp)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('pointercancel', onPointerUp)
    }
  }, [controlMode, started, camera, gl])

  // Movement frame loop
  useFrame((_, delta) => {
    if (controlMode !== 'manual' || !started) return

    const direction = new THREE.Vector3()
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    // Keyboard
    if (keys.current.w) direction.add(forward)
    if (keys.current.s) direction.sub(forward)
    if (keys.current.d) direction.add(right)
    if (keys.current.a) direction.sub(right)

    // Virtual Joystick (read from global set by VirtualJoystick component)
    const joy = window.__joystickInput || { x: 0, y: 0 }
    if (Math.abs(joy.x) > 0.1 || Math.abs(joy.y) > 0.1) {
      direction.add(forward.clone().multiplyScalar(-joy.y))
      direction.add(right.clone().multiplyScalar(joy.x))
    }

    if (direction.lengthSq() > 0) {
      direction.normalize()
      const newPos = camera.position.clone().add(direction.multiplyScalar(MOVE_SPEED * delta))
      // Apply room bounds
      newPos.x = Math.max(ROOM_BOUNDS.minX, Math.min(ROOM_BOUNDS.maxX, newPos.x))
      newPos.z = Math.max(ROOM_BOUNDS.minZ, Math.min(ROOM_BOUNDS.maxZ, newPos.z))
      newPos.y = 1.5 // Lock height
      camera.position.copy(newPos)

      // Footstep SFX — echo in secret room
      footstepTimer.current += delta
      if (footstepTimer.current >= 0.45) {
        const inSecretRoom = camera.position.z < -35
        if (inSecretRoom) {
          playFootstepEcho(isMuted)
        } else {
          playFootstep(isMuted)
        }
        footstepTimer.current = 0
      }
    } else {
      footstepTimer.current = 0.45
    }
  })

  return null
}

/* ===== Virtual Joystick (Mobile Overlay) ===== */
export function VirtualJoystick() {
  const { controlMode, isModeSelected } = useStore()
  const stickRef = useRef(null)
  const baseRef = useRef(null)
  const dragging = useRef(false)
  const center = useRef({ x: 0, y: 0 })
  const [showPulse, setShowPulse] = useState(false)

  const STICK_RADIUS = 40

  // Show onboarding pulse for manual mode
  useEffect(() => {
    if (controlMode === 'manual' && isModeSelected) {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [controlMode, isModeSelected])

  const handleStart = useCallback((e) => {
    e.preventDefault()
    setShowPulse(false) // Stop pulse when user interacts
    dragging.current = true
    const touch = e.touches ? e.touches[0] : e
    const rect = baseRef.current.getBoundingClientRect()
    center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }, [])

  const handleMove = useCallback((e) => {
    if (!dragging.current || !stickRef.current) return
    e.preventDefault()
    const touch = e.touches ? e.touches[0] : e
    let dx = touch.clientX - center.current.x
    let dy = touch.clientY - center.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > STICK_RADIUS) {
      dx = (dx / dist) * STICK_RADIUS
      dy = (dy / dist) * STICK_RADIUS
    }
    stickRef.current.style.transform = `translate(${dx}px, ${dy}px)`

    // Expose to the ManualControls via a global ref (simple approach)
    window.__joystickInput = { x: dx / STICK_RADIUS, y: dy / STICK_RADIUS }
  }, [])

  const handleEnd = useCallback(() => {
    dragging.current = false
    if (stickRef.current) stickRef.current.style.transform = `translate(0, 0)`
    window.__joystickInput = { x: 0, y: 0 }
  }, [])

  // Sync the global joystick value into the ManualControls ref
  useEffect(() => {
    window.__joystickInput = { x: 0, y: 0 }
    return () => { window.__joystickInput = { x: 0, y: 0 } }
  }, [])

  if (controlMode !== 'manual') return null

  return (
    <div
      ref={baseRef}
      className={`joystick-base ui-interactive ${showPulse ? 'onboarding-pulse' : ''}`}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
    >
      <div ref={stickRef} className="joystick-stick" />
    </div>
  )
}

