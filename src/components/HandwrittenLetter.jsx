import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'

function TerminalTypewriter({ text, delay, onFinish }) {
  const [displayedText, setDisplayedText] = useState('')
  const onFinishRef = useRef(onFinish)
  const scrollRef = useRef(null)

  // Keep ref in sync without triggering re-render
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    let i = 0
    let intervalId
    const startTyping = setTimeout(() => {
      intervalId = setInterval(() => {
        i++
        setDisplayedText(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(intervalId)
          if (onFinishRef.current) onFinishRef.current()
        }
      }, 45) // Slower for readability
    }, delay)

    return () => {
      clearTimeout(startTyping)
      if (intervalId) clearInterval(intervalId)
    }
  }, [text, delay])

  // Auto-scroll as text types
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayedText])

  return (
    <div ref={scrollRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
      <span style={{ whiteSpace: 'pre-line' }}>
        {displayedText}
        <span className="block-cursor" />
      </span>
    </div>
  )
}

export default function HandwrittenLetter({ onComplete }) {
  const { config } = useStore()
  const [step, setStep] = useState(0)

  const commitDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  const handleTypeFinish = useCallback(() => {
    setStep(2)
  }, [])

  // Stagger config for smooth section reveals
  const sectionVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: 'easeOut' }
    })
  }

  return (
    <motion.div
      className="terminal-card"
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* Terminal title bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="terminal-titlebar-text">special_letter --untuk Bintang Aprilia</span>
      </div>

      <div className="terminal-body">
        {/* Prompt line */}
        <motion.div
          variants={sectionVariants}
          custom={0.3}
          initial="hidden"
          animate="visible"
        >
          <span className="terminal-prompt">$ </span>
          <span style={{ color: 'var(--text-main)' }}>git log --format=full HEAD~1</span>
        </motion.div>

        <div style={{ height: '0.8rem' }} />

        {/* Commit hash */}
        <motion.div
          variants={sectionVariants}
          custom={1.0}
          initial="hidden"
          animate="visible"
        >
          <span className="terminal-keyword">commit </span>
          <span className="terminal-commit-hash">{config.letterCommitHash || 'a8f04d2'}</span>
        </motion.div>

        {/* Author */}
        <motion.div
          variants={sectionVariants}
          custom={1.5}
          initial="hidden"
          animate="visible"
        >
          <span className="terminal-keyword">Author: </span>
          <span className="terminal-author">{config.letterAuthor || 'Refki <refki@heart.dev>'}</span>
        </motion.div>

        {/* Recipient */}
        <motion.div
          variants={sectionVariants}
          custom={1.8}
          initial="hidden"
          animate="visible"
        >
          <span className="terminal-keyword">To:     </span>
          <span className="terminal-author">Bintang Aprilia</span>
        </motion.div>

        {/* Date */}
        <motion.div
          variants={sectionVariants}
          custom={2.2}
          initial="hidden"
          animate="visible"
        >
          <span className="terminal-keyword">Date:   </span>
          <span className="terminal-date">{commitDate}</span>
        </motion.div>

        <div style={{ height: '1rem' }} />

        {/* Commit message title */}
        <motion.div
          variants={sectionVariants}
          custom={2.8}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setStep(1)}
          style={{ paddingLeft: '1rem', fontWeight: 500, color: 'var(--accent)' }}
        >
          {config.letterCommitMsg || "fix(heart): patch vulnerability to you"}
        </motion.div>

        <div style={{ height: '0.8rem' }} />

        {/* Commit body - typed out */}
        <div className="terminal-message" style={{ minHeight: '120px' }}>
          {step >= 1 && (
            <TerminalTypewriter
              text={config.letterBody || config.letterText}
              delay={500}
              onFinish={handleTypeFinish}
            />
          )}
        </div>

        {/* Sign-off */}
        {step >= 2 && (
          <motion.div
            className="terminal-signoff"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease: 'easeOut' } }}
            onAnimationComplete={() => setTimeout(() => {
              if (onComplete) onComplete()
            }, 1000)}
          >
            {config.letterSignOff || config.letterSign}
          </motion.div>
        )}

        {/* Blinking prompt at the end */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.8 } }}
            style={{ marginTop: '1rem' }}
          >
            <span className="terminal-prompt">$ </span>
            <span className="block-cursor" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
