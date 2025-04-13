import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

export function useTheme() {
  const isDarkMode = ref(false)
  const toast = useToast()

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    saveThemePreference()
    
    // Update toast theme based on current mode
    toast.info(`Switched to ${isDarkMode.value ? 'dark' : 'light'} mode`, { timeout: 2000 })
  }

  function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    } else {
      // Check for system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
    }
  }

  function saveThemePreference() {
    localStorage.setItem('darkMode', isDarkMode.value)
  }

  onMounted(() => {
    loadThemePreference()
  })

  return {
    isDarkMode,
    toggleTheme
  }
}

