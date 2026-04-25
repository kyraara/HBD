import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '@react-three/drei'

export default function LoadingScreen({ onComplete }) {
  const { progress: realProgress } = useProgress()
  const [simulatedProgress, setSimulatedProgress] = useState(0)
  const [done, setDone] = useState(false)

  // Terminal boot log lines — SI (Sistem Informasi) themed
  const bootLines = [
    { threshold: 0, text: '[BOOT] Initializing project_memory_bank.sys...', type: 'system' },
    { threshold: 15, text: '[LOAD] Importing kenangan_bersama.jsx...', type: 'system' },
    { threshold: 30, text: '[COMPILE] Building galeri_project_v2.0...', type: 'system' },
    { threshold: 50, text: '[SCAN] Checking project_connection...', type: 'system' },
    { threshold: 65, text: '[OK] Connection established ❤️', type: 'success' },
    { threshold: 80, text: '[DECRYPT] Unlocking special_room.enc...', type: 'system' },
    { threshold: 92, text: '[DONE] User "Nyok" authenticated ✓', type: 'highlight' },
  ]

  const [visibleLines, setVisibleLines] = useState([])

  // Combine real Three.js progress with simulated progress
  const combinedProgress = Math.max(realProgress, simulatedProgress)

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setDone(true), 800)
          return 100
        }
        const increment = prev < 70 ? 2.5 : prev < 90 ? 1.2 : 0.6
        return Math.min(prev + increment, 100)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Add boot lines based on progress
  useEffect(() => {
    const roundedProgress = Math.round(combinedProgress)
    const newLines = bootLines.filter(
      line => roundedProgress >= line.threshold && !visibleLines.find(v => v.text === line.text)
    )
    if (newLines.length > 0) {
      setVisibleLines(prev => [...prev, ...newLines])
    }
  }, [combinedProgress])

  useEffect(() => {
    if (done) {
      setTimeout(() => onComplete(), 400)
    }
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loading-screen scanline-overlay"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            className="loading-content"
          >
            {/* Terminal header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem',
              paddingBottom: '0.8rem', borderBottom: '1px solid rgba(212,175,55,0.1)'
            }}>
              <span style={{ color: '#d4af37', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                nyok@sistem-informasi:~$
              </span>
              <span style={{ color: '#5a8a5a', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                ./boot.sh
              </span>
            </div>

            {/* Boot log lines */}
            <div style={{ minHeight: '180px' }}>
              <AnimatePresence>
                {visibleLines.map((line, i) => (
                  <motion.p
                    key={line.text}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`loading-text ${line.type === 'highlight' ? 'text-highlight' : ''}`}
                    style={line.type === 'success' ? { color: '#d4af37' } : {}}
                  >
                    {line.text}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="loading-bar-track">
              <motion.div
                className="loading-bar-fill"
                style={{ width: `${Math.round(combinedProgress)}%` }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="loading-percent">[{Math.round(combinedProgress)}%]</p>
              <p className="loading-percent" style={{ opacity: combinedProgress >= 100 ? 1 : 0.3 }}>
                {combinedProgress >= 100 ? 'READY' : 'LOADING...'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
