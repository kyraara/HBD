import { useRef, useEffect } from 'react'
import { useStore } from '../store'

export default function BGMPlayer({ started }) {
  const { config, isMuted, showLetter, lightboxPhoto, isSecretRoomUnlocked } = useStore()
  const bgmRef = useRef(null)
  const endRef = useRef(null)
  const secretRef = useRef(null)
  const fadingOut = useRef(false)
  const secretTransitioned = useRef(false)

  // Initialize BGM
  useEffect(() => {
    if (!started) return

    const bgm = new Audio(config.bgmUrl)
    bgm.loop = true
    bgm.volume = 0

    bgm.play().then(() => {
      let vol = 0
      const fadeIn = setInterval(() => {
        if (vol < 0.3) {
          vol = Math.min(vol + 0.01, 0.3)
          if (!fadingOut.current && !lightboxPhoto) bgm.volume = vol
        } else {
          clearInterval(fadeIn)
        }
      }, 50)
    }).catch(() => {
      console.log('BGM file not found or autoplay blocked. Skipping BGM.')
    })

    bgmRef.current = bgm

    return () => {
      bgm.pause()
      bgm.src = ''
    }
  }, [started, config.bgmUrl])

  // Mute/unmute
  useEffect(() => {
    if (bgmRef.current) bgmRef.current.muted = isMuted
    if (endRef.current) endRef.current.muted = isMuted
    if (secretRef.current) secretRef.current.muted = isMuted
  }, [isMuted])

  // Audio Ducking (reduce volume when Lightbox is open)
  useEffect(() => {
    if (!bgmRef.current || fadingOut.current || isMuted) return
    const bgm = bgmRef.current
    
    let interval;
    if (lightboxPhoto) {
      interval = setInterval(() => {
        if (bgm.volume > 0.05) {
          bgm.volume = Math.max(bgm.volume - 0.02, 0.05)
        } else clearInterval(interval)
      }, 50)
    } else {
      interval = setInterval(() => {
        if (bgm.volume < 0.3) {
          bgm.volume = Math.min(bgm.volume + 0.02, 0.3)
        } else clearInterval(interval)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [lightboxPhoto, isMuted])

  // Transition to secret room music when door opens
  useEffect(() => {
    if (!isSecretRoomUnlocked || secretTransitioned.current || fadingOut.current) return
    if (!config.bgmSecretUrl) return // Skip if no secret BGM configured
    
    secretTransitioned.current = true
    const bgm = bgmRef.current
    if (!bgm) return

    // Fade out gallery BGM
    const fadeOut = setInterval(() => {
      if (bgm.volume > 0.01) {
        bgm.volume = Math.max(bgm.volume - 0.008, 0)
      } else {
        clearInterval(fadeOut)
        bgm.pause()

        // Fade in secret room music
        const secretMusic = new Audio(config.bgmSecretUrl)
        secretMusic.loop = true
        secretMusic.volume = 0
        secretMusic.muted = isMuted
        secretMusic.play().then(() => {
          let vol = 0
          const fadeIn = setInterval(() => {
            if (vol < 0.3) {
              vol = Math.min(vol + 0.008, 0.3)
              secretMusic.volume = vol
            } else clearInterval(fadeIn)
          }, 60)
        }).catch(() => {})
        secretRef.current = secretMusic
      }
    }, 60)

    return () => clearInterval(fadeOut)
  }, [isSecretRoomUnlocked, config.bgmSecretUrl, isMuted])

  // Transition to ending music when letter appears
  useEffect(() => {
    if (!showLetter || fadingOut.current) return
    fadingOut.current = true

    // Fade out whichever is playing (gallery or secret)
    const activeBgm = secretRef.current || bgmRef.current
    if (!activeBgm) return

    const fadeOut = setInterval(() => {
      if (activeBgm.volume > 0.01) {
        activeBgm.volume = Math.max(activeBgm.volume - 0.005, 0)
      } else {
        clearInterval(fadeOut)
        activeBgm.pause()

        if (config.bgmEndUrl) {
          const endMusic = new Audio(config.bgmEndUrl)
          endMusic.loop = true
          endMusic.volume = 0
          endMusic.muted = isMuted
          endMusic.play().then(() => {
            let vol = 0
            const fadeIn = setInterval(() => {
              if (vol < 0.35) {
                vol = Math.min(vol + 0.01, 0.35)
                endMusic.volume = vol
              } else clearInterval(fadeIn)
            }, 60)
          }).catch(() => {})
          endRef.current = endMusic
        }
      }
    }, 80)

    return () => clearInterval(fadeOut)
  }, [showLetter, config.bgmEndUrl, isMuted])

  return null
}
