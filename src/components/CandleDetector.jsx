import { useEffect, useRef } from 'react'
import { useStore } from '../store'

export default function CandleDetector() {
  const { currentWaypoint, maxWaypoints, candleBlown, setCandleBlown, setShowLetter } = useStore()
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const requestFrameRef = useRef(null)

  useEffect(() => {
    // Only activate microphone when we are at the Cake view
    if (currentWaypoint !== maxWaypoints || candleBlown) return

    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        const microphone = audioContext.createMediaStreamSource(stream)
        
        microphone.connect(analyser)

        // Setup analyser
        analyser.fftSize = 256
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        microphoneRef.current = microphone

        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray)
          
          // Calculate average volume
          let sum = 0
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i]
          }
          const averageVolume = sum / bufferLength

          // Threshold for blowing (lowered to 30 for easier triggering without filter)
          if (averageVolume > 30) {
            setCandleBlown(true)
            
            // Show the letter after a short delay for dramatic effect
            setTimeout(() => {
              setShowLetter(true)
            }, 1500)
            
            // Stop processing
            return
          }

          requestFrameRef.current = requestAnimationFrame(checkVolume)
        }

        checkVolume()
      } catch (err) {
        console.error("Microphone access denied or not supported.", err)
      }
    }

    initMicrophone()

    return () => {
      if (requestFrameRef.current) cancelAnimationFrame(requestFrameRef.current)
      if (microphoneRef.current) microphoneRef.current.disconnect()
      if (analyserRef.current) analyserRef.current.disconnect()
      if (audioContextRef.current) audioContextRef.current.close().catch(console.error)
    }
  }, [currentWaypoint, maxWaypoints, candleBlown, setCandleBlown, setShowLetter])

  return null // Renderless logic component
}
