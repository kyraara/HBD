import React, { useState } from 'react'
import { Text, Html } from '@react-three/drei'
import { useStore } from '../store'

export default function EasterEgg() {
  const { config } = useStore()
  const [clicked, setClicked] = useState(false)

  return (
    <group position={config.easterEggPosition}>
      {/* A small medical capsule floating */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <capsuleGeometry args={[0.08, 0.15, 4, 16]} />
        {/* Capsule Half 1 */}
        <meshStandardMaterial attach="material-0" color="#e83e8c" roughness={0.2} />
        {/* Capsule Half 2 */}
        <meshStandardMaterial attach="material-1" color="#fefefe" roughness={0.1} />
        <meshStandardMaterial color="#e83e8c" />
      </mesh>

      {clicked && (
        <Html position={[0, 0.3, 0]} center>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '10px 15px',
            borderRadius: '8px',
            color: '#333',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            whiteSpace: 'pre-wrap',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            border: '1px solid #e83e8c',
            minWidth: '200px',
            textAlign: 'center'
          }}>
            {config.easterEggText}
          </div>
        </Html>
      )}
    </group>
  )
}
