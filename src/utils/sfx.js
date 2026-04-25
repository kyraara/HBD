// Web Audio API Synthesized Sound Effects
// Tech-themed SFX without external MP3 files

let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 1. Soft UI Click (digital beep)
export const playUIClick = (isMuted) => {
  if (isMuted) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

// 2. Swoosh (Lightbox opening / door sliding)
export const playSwoosh = (isMuted) => {
  if (isMuted) return;
  try {
    initAudio();
    const bufferSize = audioCtx.sampleRate * 0.4; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.4);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noiseSource.start();
  } catch (e) {}
}

// 3. Normal footstep (muffled carpet thud)
export const playFootstep = (isMuted) => {
  if (isMuted) return;
  try {
    initAudio();
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 150;
    filter.Q.value = 1.0;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
  } catch (e) {}
}

// 4. Echo footstep for Secret Room (hollow reverb thud)
export const playFootstepEcho = (isMuted) => {
  if (isMuted) return;
  try {
    initAudio();
    const now = audioCtx.currentTime;

    // Create base thud
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass for hollow sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 120;
    filter.Q.value = 0.8;

    // Main gain
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Delay for echo effect
    const delay1 = audioCtx.createDelay(1.0);
    delay1.delayTime.value = 0.15;
    const delay1Gain = audioCtx.createGain();
    delay1Gain.gain.value = 0.04;

    const delay2 = audioCtx.createDelay(1.0);
    delay2.delayTime.value = 0.3;
    const delay2Gain = audioCtx.createGain();
    delay2Gain.gain.value = 0.02;

    // Connect: noise → filter → gain → destination
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    // Echo taps: gain → delay → delayGain → destination
    gain.connect(delay1);
    delay1.connect(delay1Gain);
    delay1Gain.connect(audioCtx.destination);

    gain.connect(delay2);
    delay2.connect(delay2Gain);
    delay2Gain.connect(audioCtx.destination);

    noise.start();
  } catch (e) {}
}
