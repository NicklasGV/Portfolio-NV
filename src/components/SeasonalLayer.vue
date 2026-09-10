<template>
  <canvas
    v-if="season && motionAllowed"
    ref="canvasEl"
    class="seasonal"
    aria-hidden="true"
  ></canvas>

  <Transition name="greeting">
    <aside
      v-if="showGreeting"
      class="greeting"
      role="status"
      :style="{ '--season-accent': season.accent }"
    >
      <p class="greeting__title">{{ greeting.title }}</p>
      <p class="greeting__message">{{ greeting.message }}</p>
      <button
        type="button"
        class="greeting__close"
        :aria-label="t.season.dismiss"
        :title="t.season.dismiss"
        @click="dismissGreeting"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { useDarkMode } from '../composables/useDarkMode'
import { useSeason } from '../composables/useSeason'

const { t } = useLanguage()
const { isDarkMode } = useDarkMode()
const { season, celebratedYear, reducedMotion, isOverridden } = useSeason()

const canvasEl = ref(null)

// Reduced motion switches the particles off, because they are decoration and
// nothing else. Asking for one by name is a different thing though: a ?season=
// link or the terminal command is a deliberate request from the person
// looking at the page, and that outranks the global default.
const motionAllowed = computed(() => !reducedMotion.value || isOverridden.value)

// One recipe per effect. `speed` is pixels per second downwards, so embers use
// a negative range and rise instead. Counts are for a desktop viewport and get
// scaled down on narrower screens further below.
//
// Two palettes per recipe because the site has both themes: white snow is
// invisible on the light background, and a black bat is invisible on the dark
// one, so each effect declares what reads against each ground.
const RECIPES = {
  snow: {
    count: 70,
    render: 'glyph',
    glyphs: ['❄', '❅', '❆', '•'],
    colors: ['#38bdf8', '#7dd3fc', '#818cf8'],
    darkColors: ['#ffffff', '#e0f2fe', '#bae6fd'],
    size: [7, 18],
    speed: [16, 46],
    drift: [-14, 14],
    spin: [-40, 40],
    sway: [0.4, 1.1],
    swayAmp: [6, 22],
    alpha: [0.45, 0.9],
  },
  confetti: {
    count: 110,
    render: 'confetti',
    colors: ['#eab308', '#db2777', '#0891b2', '#7c3aed', '#16a34a', '#e11d48'],
    darkColors: ['#facc15', '#f472b6', '#22d3ee', '#a78bfa', '#4ade80', '#fb7185'],
    size: [5, 11],
    speed: [90, 190],
    drift: [-45, 45],
    spin: [-320, 320],
    sway: [0.6, 1.6],
    swayAmp: [10, 30],
    alpha: [0.8, 1],
    fireworks: true,
  },
  petal: {
    count: 50,
    render: 'petal',
    colors: ['#f472b6', '#fb7185', '#e879f9', '#fbbf24'],
    darkColors: ['#fbcfe8', '#f9a8d4', '#fecdd3', '#fde68a'],
    size: [6, 14],
    speed: [22, 55],
    drift: [-30, 30],
    spin: [-90, 90],
    sway: [0.7, 1.7],
    swayAmp: [14, 34],
    alpha: [0.5, 0.95],
  },
  leaf: {
    count: 38,
    render: 'leaf',
    colors: ['#c2410c', '#b45309', '#a16207', '#9a3412', '#b91c1c'],
    darkColors: ['#fb923c', '#f59e0b', '#fbbf24', '#f97316', '#ef4444'],
    size: [8, 17],
    speed: [26, 62],
    drift: [-34, 34],
    spin: [-120, 120],
    sway: [0.5, 1.3],
    swayAmp: [16, 40],
    alpha: [0.6, 1],
  },
  bat: {
    count: 14,
    render: 'bat',
    colors: ['#1e1b4b', '#312e81', '#4c1d95'],
    darkColors: ['#a78bfa', '#818cf8', '#c4b5fd'],
    size: [10, 26],
    speed: [30, 70],
    drift: [-55, 55],
    spin: [0, 0],
    // A bat banks a little as it flies. It does not somersault.
    tilt: [-0.3, 0.3],
    sway: [1.2, 2.6],
    swayAmp: [20, 55],
    alpha: [0.4, 0.8],
  },
  ember: {
    count: 80,
    render: 'ember',
    colors: ['#ea580c', '#d97706', '#dc2626', '#f59e0b'],
    darkColors: ['#fb923c', '#fbbf24', '#f87171', '#fde68a'],
    size: [1.5, 4],
    speed: [-72, -26],
    drift: [-16, 16],
    spin: [0, 0],
    sway: [0.8, 2],
    swayAmp: [8, 24],
    alpha: [0.4, 1],
  },
  code: {
    count: 55,
    render: 'code',
    glyphs: ['0', '1', '{', '}', '</>', ';', '=>', '&&', '[]', '#!', '()', 'npm', 'git', '256'],
    colors: ['#0e7490', '#6d28d9', '#15803d', '#0369a1'],
    darkColors: ['#22d3ee', '#a78bfa', '#4ade80', '#38bdf8'],
    size: [10, 20],
    speed: [30, 95],
    drift: [-6, 6],
    spin: [0, 0],
    // Upright, always: rotated source code is just noise.
    tilt: [0, 0],
    sway: [0, 0.25],
    swayAmp: [0, 6],
    alpha: [0.25, 0.8],
  },
}

const TAU = Math.PI * 2
const MONO = "'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace"
const GRAVITY = 150

const rand = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

const recipe = computed(() => (season.value ? RECIPES[season.value.effect] : null))

const greeting = computed(() => {
  const copy = season.value ? t.value.season.occasions[season.value.id] : null

  if (!copy?.title) {
    return null
  }

  return {
    title: copy.title.replace('{year}', celebratedYear.value),
    message: copy.message,
  }
})

// Dismissal lives in sessionStorage, not localStorage: a greeting that never
// comes back is a greeting nobody sees next Christmas either.
const dismissed = ref(false)
const storageKey = computed(() => (season.value ? `season-greeting:${season.value.id}` : null))

const readDismissed = () => {
  if (!storageKey.value || typeof window === 'undefined') {
    return false
  }

  try {
    return window.sessionStorage.getItem(storageKey.value) === '1'
  } catch {
    return false
  }
}

const dismissGreeting = () => {
  dismissed.value = true

  try {
    window.sessionStorage.setItem(storageKey.value, '1')
  } catch {
    // Private browsing. Losing the dismissal for this visit is acceptable.
  }
}

const showGreeting = computed(
  () => Boolean(season.value?.banner) && Boolean(greeting.value) && !dismissed.value,
)

let ctx = null
let frameId = null
let lastFrame = 0
let width = 0
let height = 0
let particles = []
let rockets = []
let sparks = []
let nextRocket = 0

// Cached per colour, because a sprite drawn with drawImage ignores fillStyle
// and would otherwise glow white regardless of which ember it belongs to.
const emberSprites = new Map()

const palette = () =>
  (isDarkMode.value ? recipe.value.darkColors : recipe.value.colors) ?? recipe.value.colors

// Embers and fireworks want a soft glow, and building a radial gradient per
// particle per frame is exactly the kind of thing that made this page lag
// before. A handful of sprites drawn with drawImage cost almost nothing.
const glowSprite = (color) => {
  const cached = emberSprites.get(color)

  if (cached) {
    return cached
  }

  const size = 32
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size

  const spriteCtx = sprite.getContext('2d')
  const gradient = spriteCtx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.4, `${color}99`)
  // Same colour at zero alpha rather than 'transparent', which is rgba(0,0,0,0)
  // and fades the glow through grey on its way out.
  gradient.addColorStop(1, `${color}00`)

  spriteCtx.globalAlpha = 0.85
  spriteCtx.fillStyle = gradient
  spriteCtx.fillRect(0, 0, size, size)

  emberSprites.set(color, sprite)
  return sprite
}

const spawn = (initial) => {
  const config = recipe.value
  const rising = config.speed[1] < 0
  const margin = config.size[1] * 3

  return {
    x: rand(-margin, width + margin),
    // On the first frame they fill the viewport, so the effect does not start
    // with an empty screen and a slow drip from the top edge.
    y: initial ? rand(-margin, height + margin) : rising ? height + margin : -margin,
    size: rand(config.size[0], config.size[1]),
    vy: rand(config.speed[0], config.speed[1]),
    vx: rand(config.drift[0], config.drift[1]),
    // Most shapes look right at any angle. Anything readable does not, so a
    // recipe can pin how far it is allowed to start rotated.
    rotation: config.tilt ? rand(config.tilt[0], config.tilt[1]) : rand(0, TAU),
    spin: (rand(config.spin[0], config.spin[1]) * Math.PI) / 180,
    sway: rand(config.sway[0], config.sway[1]),
    swayAmp: rand(config.swayAmp[0], config.swayAmp[1]),
    alpha: rand(config.alpha[0], config.alpha[1]),
    phase: rand(0, TAU),
    color: pick(palette()),
    glyph: config.glyphs ? pick(config.glyphs) : null,
    life: rand(0, 12),
  }
}

const particleCount = () => {
  const config = recipe.value
  // Phones have fewer pixels and less thermal headroom, and a full desktop
  // count of particles on a 375px screen reads as a blizzard anyway.
  const scale = Math.min(1, Math.max(0.4, width / 1440))
  return Math.round(config.count * scale * (season.value.density ?? 1))
}

const populate = () => {
  particles = Array.from({ length: particleCount() }, () => spawn(true))
}

const resize = () => {
  const canvas = canvasEl.value

  if (!canvas) {
    return
  }

  // Capped: a 3x device pixel ratio triples the fill cost for a decorative
  // layer nobody is inspecting at pixel level.
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const drawPetalPath = (size) => {
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.95, -size * 0.45, size * 0.6, size * 0.75, 0, size)
  ctx.bezierCurveTo(-size * 0.6, size * 0.75, -size * 0.95, -size * 0.45, 0, -size)
  ctx.closePath()
}

const drawBat = (particle) => {
  const size = particle.size
  const flap = (Math.sin(particle.life * 6 + particle.phase) + 1) / 2
  const lift = -size * 0.45 * flap

  ctx.beginPath()
  ctx.ellipse(0, 0, size * 0.17, size * 0.3, 0, 0, TAU)
  ctx.fill()

  for (const direction of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(0, -size * 0.12)
    ctx.quadraticCurveTo(direction * size * 0.55, lift - size * 0.4, direction * size, lift)
    ctx.quadraticCurveTo(direction * size * 0.72, lift + size * 0.22, direction * size * 0.55, lift + size * 0.1)
    ctx.quadraticCurveTo(direction * size * 0.45, lift + size * 0.34, direction * size * 0.3, lift + size * 0.14)
    ctx.quadraticCurveTo(direction * size * 0.18, lift + size * 0.36, 0, size * 0.18)
    ctx.closePath()
    ctx.fill()
  }
}

const drawParticle = (particle) => {
  const { render } = recipe.value

  ctx.save()
  ctx.translate(particle.x, particle.y)
  ctx.globalAlpha = particle.alpha
  ctx.fillStyle = particle.color

  if (render === 'ember') {
    // 'lighter' makes overlapping embers brighten each other the way sparks do.
    ctx.globalCompositeOperation = 'lighter'
    const glow = particle.size * 7
    ctx.globalAlpha = particle.alpha * 0.85
    ctx.drawImage(glowSprite(particle.color), -glow / 2, -glow / 2, glow, glow)
    ctx.globalAlpha = particle.alpha
    ctx.beginPath()
    ctx.arc(0, 0, particle.size, 0, TAU)
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.rotate(particle.rotation)

  if (render === 'glyph' || render === 'code') {
    ctx.font = `${render === 'code' ? '600 ' : ''}${particle.size}px ${render === 'code' ? MONO : 'system-ui, sans-serif'}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(particle.glyph, 0, 0)
  } else if (render === 'confetti') {
    // Squashing vertically over time reads as a rectangle tumbling in 3D.
    const flip = Math.abs(Math.cos(particle.life * 3.2 + particle.phase))
    ctx.scale(1, Math.max(0.12, flip))
    ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.66)
  } else if (render === 'petal') {
    ctx.scale(Math.max(0.35, Math.abs(Math.cos(particle.life * 1.6 + particle.phase))), 1)
    drawPetalPath(particle.size)
    ctx.fill()
  } else if (render === 'leaf') {
    ctx.scale(Math.max(0.3, Math.abs(Math.cos(particle.life * 1.2 + particle.phase))), 1)
    drawPetalPath(particle.size)
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'
    ctx.lineWidth = Math.max(0.6, particle.size * 0.06)
    ctx.beginPath()
    ctx.moveTo(0, -particle.size * 0.85)
    ctx.lineTo(0, particle.size * 0.85)
    ctx.stroke()
  } else if (render === 'bat') {
    drawBat(particle)
  }

  ctx.restore()
}

const launchRocket = () => {
  rockets.push({
    x: rand(0.15, 0.85) * width,
    y: height,
    vy: -rand(300, 430),
    targetY: rand(0.1, 0.4) * height,
    color: pick(palette()),
  })
}

const explode = (rocket) => {
  const count = 34

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * TAU + rand(-0.06, 0.06)
    const speed = rand(60, 190)

    sparks.push({
      x: rocket.x,
      y: rocket.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(0.9, 1.5),
      color: rocket.color,
    })
  }
}

const stepFireworks = (delta) => {
  nextRocket -= delta

  if (nextRocket <= 0 && rockets.length < 3) {
    launchRocket()
    nextRocket = rand(0.9, 2.2)
  }

  rockets = rockets.filter((rocket) => {
    rocket.y += rocket.vy * delta

    if (rocket.y <= rocket.targetY) {
      explode(rocket)
      return false
    }

    return true
  })

  sparks = sparks.filter((spark) => {
    spark.life += delta
    spark.vy += GRAVITY * delta
    spark.x += spark.vx * delta
    spark.y += spark.vy * delta
    return spark.life < spark.maxLife
  })

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  rockets.forEach((rocket) => {
    ctx.globalAlpha = 0.9
    ctx.drawImage(glowSprite(rocket.color), rocket.x - 9, rocket.y - 9, 18, 18)
  })

  sparks.forEach((spark) => {
    const fade = 1 - spark.life / spark.maxLife
    ctx.globalAlpha = fade * fade
    ctx.fillStyle = spark.color
    ctx.beginPath()
    ctx.arc(spark.x, spark.y, 2.2, 0, TAU)
    ctx.fill()
  })

  ctx.restore()
}

const step = (delta) => {
  const config = recipe.value
  const rising = config.speed[1] < 0
  const margin = config.size[1] * 3

  particles.forEach((particle) => {
    particle.life += delta
    particle.y += particle.vy * delta
    particle.x +=
      particle.vx * delta + Math.cos(particle.life * particle.sway + particle.phase) * particle.swayAmp * delta
    particle.rotation += particle.spin * delta

    if (rising ? particle.y < -margin : particle.y > height + margin) {
      Object.assign(particle, spawn(false))
    }

    if (particle.x < -margin) {
      particle.x = width + margin
    } else if (particle.x > width + margin) {
      particle.x = -margin
    }
  })
}

const paint = () => {
  ctx.clearRect(0, 0, width, height)
  particles.forEach(drawParticle)
}

const loop = (timestamp) => {
  // Clamped: coming back from a background tab otherwise hands us a delta of
  // several seconds and teleports every particle off screen at once.
  const delta = Math.min((timestamp - lastFrame) / 1000, 0.05)
  lastFrame = timestamp

  step(delta)
  paint()

  if (recipe.value.fireworks) {
    stepFireworks(delta)
  }

  frameId = requestAnimationFrame(loop)
}

const stop = () => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
}

const start = () => {
  if (frameId !== null || !ctx) {
    return
  }

  lastFrame = performance.now()
  frameId = requestAnimationFrame(loop)
}

const handleVisibility = () => {
  if (document.hidden) {
    stop()
  } else {
    start()
  }
}

const handleResize = () => {
  resize()
  populate()

  if (frameId === null) {
    paint()
  }
}

const teardown = () => {
  stop()
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibility)
  particles = []
  rockets = []
  sparks = []
  ctx = null
}

const setup = () => {
  if (!canvasEl.value || !recipe.value) {
    return
  }

  resize()
  populate()
  nextRocket = 0.4

  window.addEventListener('resize', handleResize, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
  start()
}

// The canvas is only in the DOM when motion is allowed, so this reacts to the
// ref appearing and disappearing as well as to the occasion changing. Someone
// who turns the OS animation setting off mid-visit gets the particles removed
// rather than frozen in place, which reads as broken rather than as calm.
watch(
  [season, canvasEl],
  ([nextSeason, canvas]) => {
    teardown()
    dismissed.value = readDismissed()

    if (nextSeason && canvas) {
      setup()
    }
  },
  { immediate: true, flush: 'post' },
)

// Repopulating swaps every particle onto the palette that reads against the
// new background, rather than leaving white snow on a white page.
watch(isDarkMode, () => {
  if (!ctx) {
    return
  }

  particles.forEach((particle) => {
    particle.color = pick(palette())
  })

  if (frameId === null) {
    paint()
  }
})

onBeforeUnmount(teardown)
</script>

<style lang="scss" scoped>
.seasonal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  // Above the section backgrounds, below the header, palette and skip link.
  z-index: 3;
}

.greeting {
  // Anchored to the bottom, not under the header. The header changes height
  // between breakpoints, and a card pinned below a moving edge either overlaps
  // it or floats away from it.
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 900;
  max-width: 280px;
  padding: 1.1rem 2.4rem 1.1rem 1.25rem;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--season-accent);
  box-shadow: 0 14px 40px var(--shadow-color);
}

.greeting__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}

.greeting__message {
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.greeting__close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: flex;
  padding: 0.3rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;

  svg {
    width: 15px;
    height: 15px;
    stroke-width: 2.2;
  }

  &:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
  }
}

.greeting-enter-active,
.greeting-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.greeting-enter-from,
.greeting-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@include mobile {
  .greeting {
    bottom: 12px;
    right: 12px;
    left: 12px;
    max-width: none;
  }

  .greeting__title {
    font-size: 1.15rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .greeting-enter-active,
  .greeting-leave-active {
    transition: none;
  }
}
</style>
