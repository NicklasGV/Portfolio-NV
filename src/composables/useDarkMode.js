import { ref, computed, watch } from 'vue'

const isDarkMode = ref(false)

// Initialize on load
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    isDarkMode.value = saved === 'true'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // Update theme immediately
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
}

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    updateTheme()
  }

  const updateTheme = () => {
    if (typeof document !== 'undefined') {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Watch for changes and update theme
  watch(isDarkMode, () => {
    updateTheme()
  })

  // Initial update
  updateTheme()

  return {
    isDarkMode: computed(() => isDarkMode.value),
    toggleDarkMode
  }
}

