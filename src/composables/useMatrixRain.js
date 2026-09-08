import { ref } from 'vue'

const isActive = ref(false)

export function useMatrixRain() {
  const start = () => {
    isActive.value = true
  }

  const stop = () => {
    isActive.value = false
  }

  const toggle = () => {
    isActive.value = !isActive.value
    return isActive.value
  }

  return {
    isActive,
    start,
    stop,
    toggle
  }
}
