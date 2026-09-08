import { ref } from 'vue'

// Per-game best score, kept in localStorage. Every read and write is guarded:
// private windows and blocked site data throw on access rather than returning null.
export function useHighScore(game) {
  const storageKey = `arcade:${game}:best`
  const best = ref(0)

  try {
    best.value = Number(localStorage.getItem(storageKey)) || 0
  } catch {
    best.value = 0
  }

  const submit = (score) => {
    if (score <= best.value) {
      return false
    }

    best.value = score

    try {
      localStorage.setItem(storageKey, String(score))
    } catch {
      // Storage unavailable: the score still counts for this session.
    }

    return true
  }

  return { best, submit }
}
