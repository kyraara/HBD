import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { playSwoosh, playUIClick } from '../utils/sfx'

export default function Lightbox() {
  const { lightboxPhoto, setLightboxPhoto, isMuted } = useStore()
  const audioRef = useRef(null)

  // SFX and Voice message logic
  useEffect(() => {
    if (lightboxPhoto) {
      playSwoosh(isMuted)
      if (lightboxPhoto.audioUrl) {
        const audio = new Audio(lightboxPhoto.audioUrl)
        audio.muted = isMuted
        audio.play().catch(e => console.log('Audio autoplay blocked', e))
        audioRef.current = audio
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [lightboxPhoto, isMuted])

  if (!lightboxPhoto) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          playUIClick(isMuted)
          setLightboxPhoto(null)
        }}
      >
        <motion.div 
          className="lightbox-content"
          initial={{ scale: 0.6, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, mass: 1 } }}
          exit={{ scale: 0.8, opacity: 0, y: 20, transition: { duration: 0.15 } }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            className="lightbox-close" 
            onClick={() => {
              playUIClick(isMuted)
              setLightboxPhoto(null)
            }}
          >
            ✕
          </button>

          {/* Photo */}
          <div className="lightbox-frame">
            <img 
              src={lightboxPhoto.url} 
              alt={lightboxPhoto.text}
              className="lightbox-img"
            />
          </div>

          {/* Voice Indicator */}
          {lightboxPhoto.audioUrl && (
            <motion.div 
              className="voice-indicator"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            >
              <span className="voice-icon">🎤</span>
              <span className="voice-text">Pesan Suara Memutar...</span>
              <div className="voice-wave">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            </motion.div>
          )}

          {/* Caption */}
          <motion.h2 
            className="lightbox-title"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
          >
            {lightboxPhoto.text}
          </motion.h2>

          {/* Memory text */}
          {lightboxPhoto.memory && (
            <motion.p 
              className="lightbox-memory"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
            >
              "{lightboxPhoto.memory}"
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
