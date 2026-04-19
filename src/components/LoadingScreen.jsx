import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  
  // Loading texts themed like medical records booting up
  const loadingTexts = [
    "Menyiapkan sesuatu yang spesial...",
    "Mengakses rekam memori...",
    "Mengecek tanda-tanda vital...",
    "Pasien: Cha [DITEMUKAN]"
  ]
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    // Simulate smooth loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setDone(true), 1000) // Linger a bit on 100%
          return 100
        }
        // Slow down near the end for dramatic effect
        const increment = prev < 70 ? 3 : prev < 90 ? 1.5 : 0.8
        
        // Change text based on progress
        if (prev > 25 && prev < 50) setTextIndex(1)
        if (prev > 50 && prev < 85) setTextIndex(2)
        if (prev > 85) setTextIndex(3)
        
        return Math.min(prev + increment, 100)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (done) {
      setTimeout(() => onComplete(), 500)
    }
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div 
          className="loading-screen"
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            className="loading-content"
          >
            <AnimatePresence mode="wait">
              <motion.p 
                key={textIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className={`loading-text ${textIndex === 3 ? 'text-highlight' : ''}`}
                style={textIndex === 3 ? { color: '#ff6b9a', fontWeight: 'bold', letterSpacing: '2px' } : {}}
              >
                {loadingTexts[textIndex]}
              </motion.p>
            </AnimatePresence>
            
            <div className="loading-bar-track">
              <motion.div 
                className="loading-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="loading-percent">{Math.round(progress)}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

