import { computed, ref } from 'vue'

// The calendar behind the decorative layer. Snow in December and confetti at
// New Year used to live in two separate components, each with its own date
// check and its own pile of animated DOM nodes. This is the single list they
// were both reinventing, so adding an occasion is now one entry here plus one
// block of copy per language.
//
// `effect` names a recipe in SeasonalLayer.vue. `banner` marks the handful of
// days that get a greeting card as well as particles: the rest are ambient and
// should never interrupt someone reading the page.

const ordinal = (month, day) => month * 100 + day

// Windows are inclusive and may wrap the year end, which New Year needs.
const inWindow = (date, [fromMonth, fromDay], [toMonth, toDay]) => {
  const today = ordinal(date.getMonth(), date.getDate())
  const start = ordinal(fromMonth, fromDay)
  const end = ordinal(toMonth, toDay)

  return start <= end ? today >= start && today <= end : today >= start || today <= end
}

const dayOfYear = (date) => {
  const startOfYear = Date.UTC(date.getFullYear(), 0, 1)
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((today - startOfYear) / 86400000) + 1
}

// Narrow windows come first, because the first match wins and Halloween has to
// beat the autumn window it sits inside.
export const OCCASIONS = [
  {
    // Day 256: the largest power of two that fits in a byte, and the last one
    // that fits in a year. Falls on 13 September, or the 12th in a leap year.
    id: 'programmers-day',
    effect: 'code',
    accent: '#22d3ee',
    banner: true,
    match: (date) => dayOfYear(date) === 256,
  },
  {
    id: 'newyear',
    effect: 'confetti',
    accent: '#facc15',
    banner: true,
    from: [11, 30],
    to: [0, 2],
  },
  {
    id: 'christmas',
    effect: 'snow',
    accent: '#bae6fd',
    banner: true,
    from: [11, 23],
    to: [11, 26],
  },
  {
    id: 'advent',
    effect: 'snow',
    accent: '#bae6fd',
    from: [11, 1],
    to: [11, 22],
  },
  {
    id: 'winter',
    effect: 'snow',
    accent: '#bae6fd',
    density: 0.6,
    from: [0, 3],
    to: [1, 15],
  },
  {
    id: 'spring',
    effect: 'petal',
    accent: '#f9a8d4',
    from: [3, 1],
    to: [4, 10],
  },
  {
    // Sankt Hans is the 23rd, but the week around it is bonfire season.
    id: 'midsummer',
    effect: 'ember',
    accent: '#fb923c',
    banner: true,
    from: [5, 20],
    to: [5, 26],
  },
  {
    id: 'autumn',
    effect: 'leaf',
    accent: '#f97316',
    from: [9, 1],
    to: [9, 23],
  },
  {
    id: 'halloween',
    effect: 'bat',
    accent: '#f97316',
    banner: true,
    from: [9, 24],
    to: [9, 31],
  },
]

export const OCCASION_IDS = OCCASIONS.map((occasion) => occasion.id)

const byId = (id) => OCCASIONS.find((occasion) => occasion.id === id) ?? null

// 'off' is a real value, not an absence: it means "explicitly suppressed",
// which is different from "nothing overridden, use the calendar".
const override = ref(null)

// Tracked live rather than read once, so toggling the OS setting takes effect
// without a reload. Every one of these effects is decorative background
// motion, which is exactly what this setting exists to switch off.
const reducedMotion = ref(false)

if (typeof window !== 'undefined') {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = query.matches
  query.addEventListener('change', (event) => {
    reducedMotion.value = event.matches
  })
}

// A ?season= link makes any occasion shareable and reviewable out of season,
// which is the only practical way to check that Halloween looks right in March.
if (typeof window !== 'undefined') {
  const requested = new URLSearchParams(window.location.search).get('season')

  if (requested === 'off' || byId(requested)) {
    override.value = requested
  }
}

export const setSeasonOverride = (id) => {
  if (id === null || id === 'off' || byId(id)) {
    override.value = id
    return true
  }

  return false
}

export const resolveOccasion = (date = new Date()) =>
  OCCASIONS.find((occasion) =>
    occasion.match ? occasion.match(date) : inWindow(date, occasion.from, occasion.to),
  ) ?? null

export function useSeason() {
  const season = computed(() => {
    if (override.value === 'off') {
      return null
    }

    return override.value ? byId(override.value) : resolveOccasion()
  })

  // New Year runs across the year boundary, so on 30 December the year worth
  // celebrating is the one that has not started yet.
  const celebratedYear = computed(() => {
    const now = new Date()
    return now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear()
  })

  return {
    season,
    celebratedYear,
    reducedMotion,
    isOverridden: computed(() => override.value !== null),
    setSeasonOverride,
  }
}
