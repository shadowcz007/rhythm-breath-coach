
/**
 * Audio utilities for Breathly app
 */

// AudioContext singleton
let audioContext: AudioContext | null = null;

/**
 * Initialize or get the AudioContext
 */
export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

/**
 * Play a gentle bell sound to indicate end of session
 */
export const playCompletionSound = (): void => {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  // Configure oscillator
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(830, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, context.currentTime + 1.5);
  
  // Configure gain (volume envelope)
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
  
  // Connect and start
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start();
  oscillator.stop(context.currentTime + 1.5);
};

/**
 * Play a gentle tick sound for breath transitions
 */
export const playTransitionSound = (volume = 0.05): void => {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  // Configure oscillator
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, context.currentTime);
  
  // Configure gain (volume envelope)
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
  
  // Connect and start
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start();
  oscillator.stop(context.currentTime + 0.3);
};

/**
 * Initialize audio to overcome browser autoplay restrictions
 * Must be called from a user interaction event
 */
export const initAudio = (): void => {
  const context = getAudioContext();
  
  // Create and immediately suspend a silent oscillator
  // This primes the audio context for later use
  if (context.state === 'suspended') {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.001);
    
    context.resume();
  }
};
