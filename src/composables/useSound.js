import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

export function useSound() {
  const soundEnabled = ref(true)
  const toast = useToast()

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    localStorage.setItem('soundEnabled', soundEnabled.value)
    
    toast.info(`Sound notifications ${soundEnabled.value ? 'enabled' : 'disabled'}`, { timeout: 2000 })
    
    // Play a test sound when enabling
    if (soundEnabled.value) {
      playUiSound()
    }
  }

  function loadSoundPreference() {
    const savedSoundPreference = localStorage.getItem('soundEnabled')
    if (savedSoundPreference !== null) {
      soundEnabled.value = savedSoundPreference === 'true'
    }
  }

  function playSound(type, options = {}) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Different sound configurations for different notifications
      switch (type) {
        case 'due-today':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
          oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime + 0.2) // D5
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.4)
          break
          
        case 'overdue':
          oscillator.type = 'triangle'
          oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime) // D5
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.2) // A4
          oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.4) // F4
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.6)
          break
          
        case 'task-completed':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.5)
          break
          
        case 'ui':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime) // E5
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.2)
          break
          
        default:
          oscillator.type = 'sine'
          oscillator.frequency.value = options.frequency || 440
          gainNode.gain.value = options.volume || 0.2
          oscillator.start()
          oscillator.stop(audioContext.currentTime + (options.duration || 0.3))
      }
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  function playDueTodaySound() {
    if (soundEnabled.value) {
      playSound('due-today')
    }
  }

  function playOverdueSound() {
    if (soundEnabled.value) {
      playSound('overdue')
    }
  }

  function playTaskCompletedSound() {
    if (soundEnabled.value) {
      playSound('task-completed')
    }
  }

  function playUiSound() {
    if (soundEnabled.value) {
      playSound('ui')
    }
  }

  onMounted(() => {
    loadSoundPreference()
  })

  return {
    soundEnabled,
    toggleSound,
    playDueTodaySound,
    playOverdueSound,
    playTaskCompletedSound,
    playUiSound
  }
}

