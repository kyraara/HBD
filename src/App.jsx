import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useState, useEffect, useCallback } from 'react'
import { Sparkles, Preload } from '@react-three/drei'
import Room from './components/Room'
import OverlayUI from './components/OverlayUI'
import CameraPath from './components/CameraPath'
import ManualControls, { VirtualJoystick } from './components/ManualControls'
import PhotoFrame from './components/PhotoFrame'
import Cake from './components/Cake'
import Curtain from './components/Curtain'
import Gifts from './components/Gifts'
import CandleDetector from './components/CandleDetector'
import BGMPlayer from './components/BGMPlayer'
import Lightbox from './components/Lightbox'
import LoadingScreen from './components/LoadingScreen'
import Fireworks from './components/Fireworks'
import PostEffects from './components/PostEffects'
import { useStore } from './store'
import './index.css'

function ResponsiveCamera() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    const isMobile = size.width < 768 || size.width < size.height
    camera.fov = isMobile ? 85 : 55
    camera.updateProjectionMatrix()
  }, [size, camera])
  
  return null
}

function App() {
  const { config, showLetter, isMuted, toggleMute } = useStore()
  const [loaded, setLoaded] = useState(false)
  const [started, setStarted] = useState(false)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleStart = () => {
    setStarted(true)
  }

  return (
    <>
      {/* Premium Loading Screen */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.5, 0] }} gl={{ preserveDrawingBuffer: true }}>
        <ResponsiveCamera />
        <color attach="background" args={['#1a1a22']} />
        <fog attach="fog" args={['#1a1a22', 12, 38]} />
        
        <Suspense fallback={null}>
          {started && (
            <>
              <Room />
              
              <Sparkles 
                count={250} 
                scale={[12, 6, 40]} 
                position={[0, 2.5, -20]} 
                speed={0.3} 
                opacity={0.4} 
                size={1.5} 
                color="#ffe5b4" 
              />

              {config.photos.map((photo) => (
                <PhotoFrame key={photo.id} {...photo} />
              ))}
              <Curtain position={[0, 2.5, -30]} />
              <Gifts />
              <Cake position={[0, 0.4, -33]} />
            </>
          )}

          <CameraPath started={started} />
          <ManualControls started={started} />
          
          {/* Preload all textures and assets for stutter-free experience */}
          <Preload all />
          <PostEffects />
        </Suspense>
      </Canvas>

      {/* 2D Overlays */}
      {loaded && <OverlayUI started={started} onStart={handleStart} />}
      <Lightbox />
      <VirtualJoystick />
      <Fireworks active={showLetter} />

      {/* BGM */}
      <BGMPlayer started={started} />
      {started && <CandleDetector />}

      {/* Mute Toggle Button */}
      {started && !showLetter && (
        <button 
          className="mute-btn ui-interactive"
          onClick={toggleMute}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      )}
    </>
  )
}

export default App
