import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { playUIClick } from '../utils/sfx'
import HandwrittenLetter from './HandwrittenLetter'

/* ===== Typewriter Effect ===== */
function Typewriter({ text, delay = 1000, speed = 50, onFinish }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let timeout;
    let i = 0;
    const startTyping = setTimeout(() => {
      timeout = setInterval(() => {
        setDisplayedText(text.slice(0, i))
        i++
        if (i > text.length) {
          clearInterval(timeout)
          if (onFinish) onFinish()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(startTyping)
      clearInterval(timeout)
    }
  }, [text, delay, speed])

  return <span style={{ whiteSpace: 'pre-line' }}>{displayedText}<span className="cursor-blink">|</span></span>
}

/* ===== PIN Display + NumPad ===== */
function PinInput({ length = 4, onComplete, error, success }) {
  const { isMuted } = useStore()
  const [values, setValues] = useState(Array(length).fill(''))

  const currentIndex = values.findIndex(v => v === '')
  const isFull = currentIndex === -1

  const handleDigit = (digit) => {
    playUIClick(isMuted)
    if (isFull) return
    const newValues = [...values]
    newValues[currentIndex] = String(digit)
    setValues(newValues)

    // Auto-submit when all filled
    if (currentIndex === length - 1) {
      setTimeout(() => onComplete(newValues.join('')), 150)
    }
  }

  const handleBackspace = () => {
    playUIClick(isMuted)
    const newValues = [...values]
    if (isFull) {
      newValues[length - 1] = ''
    } else if (currentIndex > 0) {
      newValues[currentIndex - 1] = ''
    }
    setValues(newValues)
  }

  // Reset on error
  useEffect(() => {
    if (error) {
      setTimeout(() => setValues(Array(length).fill('')), 600)
    }
  }, [error, length])

  const numpadKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'back']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* PIN Dots Display */}
      <motion.div
        className="pin-container"
        animate={error ? { x: [-12, 12, -10, 10, -6, 6, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {values.map((val, i) => (
          <div
            key={i}
            className={`pin-dot ${val ? 'filled' : ''} ${error ? 'error' : ''} ${success ? 'success' : ''}`}
          >
            <div className="pin-dot-inner" />
          </div>
        ))}
      </motion.div>

      {/* Number Pad */}
      <div className="numpad">
        {numpadKeys.map((key, i) => {
          if (key === null) return <div key={i} className="numpad-spacer" />
          if (key === 'back') {
            return (
              <motion.button
                key={i}
                className="numpad-key numpad-back"
                onClick={handleBackspace}
                whileTap={{ scale: 0.85 }}
              >
                ⌫
              </motion.button>
            )
          }
          return (
            <motion.button
              key={i}
              className="numpad-key"
              onClick={() => handleDigit(key)}
              whileTap={{ scale: 0.85 }}
            >
              {key}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ===== Mode Selection Screen ===== */
function ModeSelector({ onSelect }) {
  const { isMuted } = useStore()

  const handleSelect = (mode) => {
    playUIClick(isMuted)
    onSelect(mode)
  }

  return (
    <motion.div
      className="mode-selector"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }}
    >
      <motion.div
        className="lock-icon unlocked"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, delay: 0.2 } }}
      >
        🔓
      </motion.div>

      <h1 className="vault-title" style={{ marginBottom: '0.5rem' }}>Selamat Datang</h1>
      <p className="mode-selector-subtitle">
        Pilih cara kamu menjelajahi galeri kenangan ini
      </p>

      <div className="mode-options">
        {/* Guided Option */}
        <motion.button
          className="mode-option-card"
          onClick={() => handleSelect('guided')}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mode-option-icon">🎬</span>
          <span className="mode-option-title">Ikuti Pemandu</span>
          <span className="mode-option-desc">Nikmati perjalanan santai menelusuri tiap kenangan</span>
          <span className="mode-option-badge">✨ Rekomendasi</span>
        </motion.button>

        {/* Manual Option */}
        <motion.button
          className="mode-option-card"
          onClick={() => handleSelect('manual')}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6 } }}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mode-option-icon">🎮</span>
          <span className="mode-option-title">Bebas Berkeliling</span>
          <span className="mode-option-desc">Eksplorasi museum sesukamu dengan joystick / WASD</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ===== Screenshot Helper ===== */
function useScreenshot() {
  const capture = useCallback(() => {
    // Capture the 3D canvas
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    try {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'hbd-momen-spesial.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.warn('Screenshot failed:', e)
    }
  }, [])

  return capture
}

/* ===== Countdown Timer ===== */
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date()
      if (difference <= 0) return null

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft()
      if (!newTime) clearInterval(timer)
      setTimeLeft(newTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) return null

  return (
    <div className="countdown-container">
      <div className="countdown-box"><span>{timeLeft.days}</span><label>Hari</label></div>
      <div className="countdown-box"><span>{String(timeLeft.hours).padStart(2, '0')}</span><label>Jam</label></div>
      <div className="countdown-box"><span>{String(timeLeft.minutes).padStart(2, '0')}</span><label>Menit</label></div>
      <div className="countdown-box"><span>{String(timeLeft.seconds).padStart(2, '0')}</span><label>Detik</label></div>
    </div>
  )
}

/* ===== Main Overlay ===== */
export default function OverlayUI({ started, onStart }) {
  const { currentWaypoint, maxWaypoints, nextWaypoint, prevWaypoint, showLetter, config, isUnlocked, isSecretRoomUnlocked, unlock, unlockSecretRoom, controlMode, setControlMode, isModeSelected, setModeSelected, isMuted, showEKG, setShowEKG } = useStore()
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)
  const [typingDone, setTypingDone] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Custom hook for checking target date
  const [isWaiting, setIsWaiting] = useState(false)
  useEffect(() => {
    if (config.birthdayDate) {
      const diff = new Date(config.birthdayDate) - new Date()
      setIsWaiting(diff > 0)

      if (diff > 0) {
        const timer = setInterval(() => {
          if (new Date(config.birthdayDate) - new Date() <= 0) {
            setIsWaiting(false)
            clearInterval(timer)
          }
        }, 1000)
        return () => clearInterval(timer)
      }
    }
  }, [config.birthdayDate])

  const captureScreenshot = useScreenshot()

  const isAtCake = currentWaypoint === maxWaypoints
  const isGuided = controlMode === 'guided'

  // Show onboarding pulse after mode is selected and tour starts
  useEffect(() => {
    if (started && isModeSelected) {
      setShowOnboarding(true)
      const timer = setTimeout(() => setShowOnboarding(false), 6000) // Hide after 6s
      return () => clearTimeout(timer)
    }
  }, [started, isModeSelected])

  const handlePinComplete = (pin) => {
    if (pin === config.secretPassword) {
      setPinSuccess(true)
      setTimeout(() => unlock(), 800)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 700)
    }
  }

  const handleModeSelect = (mode) => {
    setControlMode(mode)
    setModeSelected(true)
    onStart()
  }

  const claimGift = () => {
    playUIClick(isMuted)
    window.open(config.webhookUrl, "_blank")
  }

  const toggleMode = () => {
    playUIClick(isMuted)
    setControlMode(isGuided ? 'manual' : 'guided')
  }

  return (
    <div className="ui-overlay">
      {/* ===== VAULT SCREEN ===== */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="vault-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
          >
            {!isUnlocked ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Lock Icon */}
                <motion.div
                  className="lock-icon"
                  animate={{ scale: pinError ? [1, 0.9, 1] : 1 }}
                >
                  🔒
                </motion.div>

                <h1 className="vault-title">The Vault of Us</h1>

                <p className="vault-subtitle">{config.passwordHint}</p>
                {/* PIN Input */}
                <PinInput
                  length={config.secretPassword.length}
                  onComplete={handlePinComplete}
                  error={pinError}
                  success={pinSuccess}
                />

                {/* Error Message */}
                <AnimatePresence>
                  {pinError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem' }}
                    >
                      Hmm, bukan itu kodenya...
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* ===== MODE SELECTION SCREEN (replaces old "Mulai Tur" button) ===== */
              <ModeSelector onSelect={handleModeSelect} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODE TOGGLE (Top-Right Corner) ===== */}
      {started && !showLetter && (
        <div className="ui-interactive" style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <motion.button
            className="mode-toggle"
            onClick={toggleMode}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
          >
            {isGuided ? '🎬 Guided' : '🎮 Manual'}
          </motion.button>
        </div>
      )}

      {/* ===== MANUAL MODE HINT ===== */}
      <AnimatePresence>
        {started && !showLetter && !isGuided && (
          <motion.div
            className="ui-interactive"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}
          >
            {/* <div className="manual-hint">
              💡 WASD / Joystick untuk jalan, drag layar untuk melihat
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== NAVIGATION CONTROLS (Guided Mode Only) ===== */}
      {started && !showLetter && isGuided && (
        <div className="ui-interactive" style={{ position: 'absolute', bottom: '40px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', padding: '0 1rem' }}>

          {currentWaypoint > 0 && (
            <motion.button
              className="nav-btn"
              onClick={() => {
                playUIClick(isMuted)
                prevWaypoint()
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Kembali
            </motion.button>
          )}

          {currentWaypoint < maxWaypoints && (
            <motion.button
              className={`nav-btn ${showOnboarding && currentWaypoint === 0 ? 'onboarding-pulse' : ''}`}
              onClick={() => {
                playUIClick(isMuted)
                setShowOnboarding(false)
                nextWaypoint()
              }}
              // Jangan tampilkan tombol Lanjut jika di depan Secret Door tapi belum ke-unlock
              style={{ display: (currentWaypoint === maxWaypoints - 1 && !isSecretRoomUnlocked) ? 'none' : 'block' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              Lanjut →
            </motion.button>
          )}

          {isAtCake && (
            <motion.div
              className="blow-indicator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              💨 Tiup lilinnya lewat mic! 🎂
            </motion.div>
          )}
        </div>
      )}

      {/* ===== EKG COUNTDOWN FOR SECRET DOOR ===== */}
      <AnimatePresence>
        {started && !showLetter && (currentWaypoint === (maxWaypoints - 1) || showEKG) && !isSecretRoomUnlocked && (
          <motion.div 
            className="ekg-countdown ui-interactive"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'relative' }}
          >
            {controlMode === 'manual' && (
              <button 
                onClick={() => setShowEKG(false)}
                style={{ position: 'absolute', top: 10, right: 15, background: 'none', border: 'none', color: '#ff6b9a', cursor: 'pointer', fontSize: '1.2rem'}}
              >
                ✕
              </button>
            )}
            <p className="ekg-message">Belum waktunya...</p>
            <div className="ekg-line">
              <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none">
                <polyline 
                  points="0,30 50,30 60,10 70,50 80,20 90,40 100,30 300,30" 
                  fill="none" 
                  stroke="#e83e8c" 
                  strokeWidth="3" 
                  strokeLinejoin="round" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {isWaiting ? (
              <CountdownTimer targetDate={config.birthdayDate} />
            ) : (
              <motion.button 
                className="gift-btn" 
                style={{ padding: '10px 20px', fontSize: '0.9rem', marginTop: '1rem' }}
                onClick={unlockSecretRoom}
                whileTap={{ scale: 0.9 }}
              >
                Buka Pintu
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LETTER OVERLAY ===== */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            className="letter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 2 } }}
          >
            <HandwrittenLetter onComplete={() => setTypingDone(true)} />

            {/* Action Buttons - appear after typing is done */}
              <AnimatePresence>
                {typingDone && (
                  <motion.div
                    className="letter-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                  >
                    <motion.button
                      className="gift-btn"
                      onClick={claimGift}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎁 Klaim Kado
                    </motion.button>

                    <motion.button
                      className="screenshot-btn"
                      onClick={() => {
                        playUIClick(isMuted)
                        captureScreenshot()
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.8 } }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      📸 Simpan Momen
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
