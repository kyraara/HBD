import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Simulate smooth loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setDone(true), 600)
          return 100
        }
        // Slow down near the end for dramatic effect
        const increment = prev < 70 ? 3 : prev < 90 ? 1.5 : 0.8
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
            <p className="loading-text">Menyiapkan sesuatu yang spesial...</p>
            
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
