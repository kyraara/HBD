import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

export default function CameraPath({ started }) {
  const { currentWaypoint, focusedPhoto, config, controlMode } = useStore()
  const { camera } = useThree()
  
  const waypoints = [
    { position: new THREE.Vector3(0, 1.5, 0), lookAt: new THREE.Vector3(0, 1.5, -5) },
    { position: new THREE.Vector3(1, 1.5, -6), lookAt: new THREE.Vector3(5, 1.5, -6) },
    { position: new THREE.Vector3(-1, 1.5, -13), lookAt: new THREE.Vector3(-5, 1.5, -13) },
    { position: new THREE.Vector3(1, 1.5, -20), lookAt: new THREE.Vector3(5, 1.5, -20) },
    { position: new THREE.Vector3(-1, 1.5, -27), lookAt: new THREE.Vector3(-5, 1.5, -27) }, // Photo 4
    { position: new THREE.Vector3(0, 1.5, -32), lookAt: new THREE.Vector3(0, 1.5, -36) }, // In front of Secret Door
    { position: new THREE.Vector3(0, 1.5, -37), lookAt: new THREE.Vector3(0, 0.8, -44) } // Secret Room — in front of curtain, looking at cake
  ]

  const currentVec = new THREE.Vector3()

  useFrame((state, delta) => {
    if (!started) return
    // Only run guided logic when in guided mode
    if (controlMode !== 'guided') return
    
    let targetPos, targetLook;
    
    if (focusedPhoto) {
      const photo = config.photos.find(p => p.id === focusedPhoto);
      if (photo) {
        const isRightWall = photo.position[0] > 0;
        const cameraOffsetX = isRightWall ? photo.position[0] - 2 : photo.position[0] + 2;
        targetPos = new THREE.Vector3(cameraOffsetX, photo.position[1], photo.position[2]);
        targetLook = new THREE.Vector3(...photo.position);
      }
    } else {
      const target = waypoints[currentWaypoint]
      if (target) {
        targetPos = target.position;
        targetLook = target.lookAt;
      }
    }

    if (targetPos && targetLook) {
      camera.position.lerp(targetPos, 2 * delta)
      if (!currentVec.lengthSq()) currentVec.copy(targetLook) 
      currentVec.lerp(targetLook, 2.5 * delta)
      camera.lookAt(currentVec)
    }
  })

  return null
}
