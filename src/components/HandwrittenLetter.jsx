import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

function HandwrittenTypewriter({ text, delay, onFinish }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0;
    const startTyping = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i))
        i++
        if (i > text.length) {
          clearInterval(intervalId)
          if (onFinish) onFinish()
        }
      }, 40) // Faster for cursive tying
      return () => clearInterval(intervalId)
    }, delay)

    return () => clearTimeout(startTyping)
  }, [text, delay, onFinish])

  return <span style={{ whiteSpace: 'pre-line' }}>{displayedText}</span>
}

export default function HandwrittenLetter({ onComplete }) {
  const { config } = useStore()
  const [step, setStep] = useState(0)

  // CSS for handwritten fonts added inline for simplicity
  return (
    <motion.div 
      className="prescription-card"
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease: 'easeOut' } }}
    >
      <div className="prescription-header">
        <motion.div 
          className="clinic-logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          {/* Medical Cross SVG */}
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#e83e8c" strokeWidth="8" strokeLinecap="round">
            <motion.path 
              d="M50 20 L50 80 M20 50 L80 50" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, transition: { duration: 1.5, ease: 'easeInOut' } }}
            />
          </svg>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 1 } }}
          className="prescription-rx"
        >
          {config.letterTitle}
        </motion.div>
      </div>

      <div className="prescription-body handwritten-font">
        {/* Patient Name */}
        <motion.p className="prescription-patient" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.5 } }}>
          {config.letterPatient}
        </motion.p>
        
        <div className="divider-line" />

        {/* Diagnosis */}
        <motion.p className="prescription-diagnosis" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 2.5 } }} onAnimationComplete={() => setStep(1)}>
          {config.letterDiagnosis}
        </motion.p>

        {/* Main Text */}
        <div className="prescription-notes">
          {step >= 1 && (
            <HandwrittenTypewriter 
              text={config.letterText} 
              delay={500}
              onFinish={() => setStep(2)} 
            />
          )}
        </div>

        {/* Sign */}
        <div className="prescription-footer">
          {step >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 1 } }}
              onAnimationComplete={() => setTimeout(() => {
                if (onComplete) onComplete()
              }, 1000)}
            >
              <p>{config.letterSign}</p>
              {/* Signature SVG animation */}
              <svg width="100" height="50" viewBox="0 0 200 100" className="signature-svg">
                <motion.path 
                  d="M20 80 C 40 20, 60 70, 80 50 C 100 30, 120 70, 150 40 S 180 30, 190 60" 
                  fill="none" 
                  stroke="#2c3e50" 
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, transition: { duration: 1.5, ease: 'easeOut', delay: 1 } }}
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
