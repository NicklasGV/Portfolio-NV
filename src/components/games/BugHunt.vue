<template>
  <div class="arcade">
    <div class="arcade__hud">
      <span class="hud__item">{{ t.arcade.score }} <strong>{{ score }}</strong></span>
      <span class="hud__item">{{ t.arcade.wave }} <strong>{{ wave }}</strong></span>
      <span class="hud__item">{{ t.arcade.best }} <strong>{{ highScore }}</strong></span>
      <span class="hud__item hud__hearts" :aria-label="`${t.arcade.health}: ${health}`">
        <span v-for="i in MAX_HEALTH" :key="i" class="heart" :class="{ 'heart--lost': i > health }"></span>
      </span>
    </div>

    <div ref="stageEl" class="arcade__stage">
      <canvas
        ref="canvasEl"
        class="arcade__canvas"
        :width="WIDTH"
        :height="HEIGHT"
        role="img"
        :aria-label="t.arcade.bugHunt.canvasLabel"
      ></canvas>

      <div v-if="state !== 'playing'" class="overlay">
        <div class="overlay__panel">
          <template v-if="state === 'idle'">
            <h3>{{ t.arcade.bugHunt.readyTitle }}</h3>
            <p>{{ t.arcade.bugHunt.readyBody }}</p>
          </template>

          <template v-else-if="state === 'paused'">
            <h3>{{ t.arcade.pausedTitle }}</h3>
            <p>{{ t.arcade.pausedBody }}</p>
          </template>

          <template v-else>
            <h3>{{ t.arcade.overTitle }}</h3>
            <p class="overlay__score">
              {{ t.arcade.score }} <strong>{{ score }}</strong>
              <span v-if="isNewBest" class="overlay__best">{{ t.arcade.newBest }}</span>
            </p>
            <p>{{ t.arcade.bugHunt.overBody.replace('{wave}', wave) }}</p>
          </template>

          <button type="button" class="overlay__btn" @click="primaryAction">
            {{ state === 'paused' ? t.arcade.resume : state === 'over' ? t.arcade.again : t.arcade.start }}
          </button>
        </div>
      </div>
    </div>

    <dl class="arcade__controls">
      <div><dt>WASD / ←↑↓→</dt><dd>{{ t.arcade.bugHunt.controls.move }}</dd></div>
      <div><dt>{{ t.arcade.bugHunt.controls.mouseKey }}</dt><dd>{{ t.arcade.bugHunt.controls.aim }}</dd></div>
      <div><dt>Space / {{ t.arcade.bugHunt.controls.clickKey }}</dt><dd>{{ t.arcade.bugHunt.controls.shoot }}</dd></div>
      <div><dt>Esc / P</dt><dd>{{ t.arcade.controls.pause }}</dd></div>
    </dl>
    <p class="arcade__touch-hint">{{ t.arcade.bugHunt.touchHint }}</p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLanguage } from '../../composables/useLanguage'
import { useCommandPalette } from '../../composables/useCommandPalette'
import { useHighScore } from '../../composables/useHighScore'

const { t } = useLanguage()
const { isOpen: paletteOpen } = useCommandPalette()
const { best: highScore, submit: submitScore } = useHighScore('bug-hunt')

// Small logical resolution, scaled up with smoothing off: real pixel art,
// and a backbuffer this size costs almost nothing to redraw.
const WIDTH = 480
const HEIGHT = 320
const MAX_HEALTH = 3

const canvasEl = ref(null)
const stageEl = ref(null)
const state = ref('idle')
const score = ref(0)
const wave = ref(1)
const health = ref(MAX_HEALTH)
const isNewBest = ref(false)

const SPRITES = {
  player: [
    '...#...',
    '..###..',
    '.#####.',
    '#######',
    '##.#.##',
    '.#...#.'
  ],
  bug: [
    '..#...#..',
    '...#.#...',
    '..#####..',
    '.##.#.##.',
    '#########',
    '#.#####.#',
    '#.#...#.#',
    '...#.#...'
  ]
}

const COLORS = {
  bg: '#0b1120',
  grid: 'rgba(59, 130, 246, 0.07)',
  player: '#60a5fa',
  playerHit: '#f8fafc',
  bullet: '#bfdbfe',
  bug: '#f87171',
  tank: '#fb923c',
  spark: '#93c5fd'
}

let ctx = null
let frameId = null
let lastTime = 0
let spawnTimer = 0
let waveTimer = 0
let fireTimer = 0
let invuln = 0
let shake = 0

const keys = new Set()
const player = { x: WIDTH / 2, y: HEIGHT / 2, speed: 96, r: 4 }
const aim = { x: WIDTH / 2, y: HEIGHT / 2 - 40, mode: 'auto' }
let bullets = []
let enemies = []
let sparks = []
let firing = false
let touchTarget = null

const drawSprite = (sprite, cx, cy, color, scale = 1) => {
  const w = sprite[0].length * scale
  const h = sprite.length * scale
  const ox = Math.round(cx - w / 2)
  const oy = Math.round(cy - h / 2)

  ctx.fillStyle = color

  sprite.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === '#') {
        ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale)
      }
    }
  })
}

const spawnEnemy = () => {
  const edge = Math.floor(Math.random() * 4)
  const margin = 16
  let x = 0
  let y = 0

  if (edge === 0) {
    x = Math.random() * WIDTH
    y = -margin
  } else if (edge === 1) {
    x = WIDTH + margin
    y = Math.random() * HEIGHT
  } else if (edge === 2) {
    x = Math.random() * WIDTH
    y = HEIGHT + margin
  } else {
    x = -margin
    y = Math.random() * HEIGHT
  }

  // Tanks start showing up from wave three, and stay a minority.
  const isTank = wave.value >= 3 && Math.random() < 0.18

  enemies.push({
    x,
    y,
    hp: isTank ? 3 : 1,
    tank: isTank,
    r: isTank ? 8 : 5,
    scale: isTank ? 2 : 1,
    speed: (isTank ? 20 : 32) + wave.value * 3.5 + Math.random() * 10
  })
}

const addSparks = (x, y, color, count = 8) => {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const speed = 20 + Math.random() * 70
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.25 + Math.random() * 0.3,
      max: 0.55,
      color
    })
  }
}

const nearestEnemy = () => {
  let best = null
  let bestDist = Infinity

  enemies.forEach((enemy) => {
    const dist = (enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = enemy
    }
  })

  return best
}

const fire = () => {
  let tx = aim.x
  let ty = aim.y

  if (aim.mode === 'auto') {
    const target = nearestEnemy()
    if (!target) {
      return
    }
    tx = target.x
    ty = target.y
  }

  const dx = tx - player.x
  const dy = ty - player.y
  const len = Math.hypot(dx, dy) || 1

  bullets.push({
    x: player.x,
    y: player.y,
    vx: (dx / len) * 260,
    vy: (dy / len) * 260,
    r: 2
  })
}

const hitPlayer = () => {
  if (invuln > 0) {
    return
  }

  health.value -= 1
  invuln = 1.2
  shake = 0.35
  addSparks(player.x, player.y, COLORS.playerHit, 16)

  if (health.value <= 0) {
    endGame()
  }
}

const endGame = () => {
  state.value = 'over'
  isNewBest.value = submitScore(score.value)
}

const update = (dt) => {
  invuln = Math.max(0, invuln - dt)
  shake = Math.max(0, shake - dt)

  // Movement
  let dx = 0
  let dy = 0

  if (keys.has('a') || keys.has('arrowleft')) dx -= 1
  if (keys.has('d') || keys.has('arrowright')) dx += 1
  if (keys.has('w') || keys.has('arrowup')) dy -= 1
  if (keys.has('s') || keys.has('arrowdown')) dy += 1

  if (touchTarget) {
    const tdx = touchTarget.x - player.x
    const tdy = touchTarget.y - player.y
    if (Math.hypot(tdx, tdy) > 3) {
      dx = tdx
      dy = tdy
    }
  }

  const len = Math.hypot(dx, dy)
  if (len > 0) {
    player.x += (dx / len) * player.speed * dt
    player.y += (dy / len) * player.speed * dt
  }

  player.x = Math.max(6, Math.min(WIDTH - 6, player.x))
  player.y = Math.max(6, Math.min(HEIGHT - 6, player.y))

  // Firing
  fireTimer -= dt
  if ((firing || touchTarget) && fireTimer <= 0) {
    fire()
    fireTimer = 0.15
  }

  // Waves ramp every 18 seconds.
  waveTimer += dt
  if (waveTimer >= 18) {
    waveTimer = 0
    wave.value += 1
  }

  spawnTimer -= dt
  if (spawnTimer <= 0) {
    spawnEnemy()
    spawnTimer = Math.max(0.28, 1.5 - wave.value * 0.11)
  }

  bullets = bullets.filter((bullet) => {
    bullet.x += bullet.vx * dt
    bullet.y += bullet.vy * dt
    return bullet.x > -8 && bullet.x < WIDTH + 8 && bullet.y > -8 && bullet.y < HEIGHT + 8
  })

  enemies.forEach((enemy) => {
    const edx = player.x - enemy.x
    const edy = player.y - enemy.y
    const elen = Math.hypot(edx, edy) || 1
    enemy.x += (edx / elen) * enemy.speed * dt
    enemy.y += (edy / elen) * enemy.speed * dt
  })

  // Bullet hits
  bullets = bullets.filter((bullet) => {
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i]
      if (Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < enemy.r + bullet.r) {
        enemy.hp -= 1

        if (enemy.hp <= 0) {
          addSparks(enemy.x, enemy.y, enemy.tank ? COLORS.tank : COLORS.bug, enemy.tank ? 16 : 9)
          score.value += enemy.tank ? 50 : 10
          enemies.splice(i, 1)
        } else {
          addSparks(enemy.x, enemy.y, COLORS.spark, 4)
        }

        return false
      }
    }
    return true
  })

  // Enemy touches player
  enemies.forEach((enemy) => {
    if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < enemy.r + player.r) {
      enemy.hp = 0
      addSparks(enemy.x, enemy.y, COLORS.bug, 10)
      hitPlayer()
    }
  })
  enemies = enemies.filter((enemy) => enemy.hp > 0)

  sparks = sparks.filter((spark) => {
    spark.life -= dt
    spark.x += spark.vx * dt
    spark.y += spark.vy * dt
    spark.vx *= 0.92
    spark.vy *= 0.92
    return spark.life > 0
  })
}

const render = () => {
  ctx.save()

  if (shake > 0) {
    ctx.translate((Math.random() - 0.5) * shake * 10, (Math.random() - 0.5) * shake * 10)
  }

  ctx.fillStyle = COLORS.bg
  ctx.fillRect(-12, -12, WIDTH + 24, HEIGHT + 24)

  ctx.fillStyle = COLORS.grid
  for (let x = 0; x < WIDTH; x += 24) {
    ctx.fillRect(x, 0, 1, HEIGHT)
  }
  for (let y = 0; y < HEIGHT; y += 24) {
    ctx.fillRect(0, y, WIDTH, 1)
  }

  sparks.forEach((spark) => {
    ctx.globalAlpha = Math.max(0, spark.life / spark.max)
    ctx.fillStyle = spark.color
    ctx.fillRect(Math.round(spark.x), Math.round(spark.y), 2, 2)
  })
  ctx.globalAlpha = 1

  ctx.fillStyle = COLORS.bullet
  bullets.forEach((bullet) => {
    ctx.fillRect(Math.round(bullet.x) - 1, Math.round(bullet.y) - 1, 3, 3)
  })

  enemies.forEach((enemy) => {
    drawSprite(SPRITES.bug, enemy.x, enemy.y, enemy.tank ? COLORS.tank : COLORS.bug, enemy.scale)
  })

  // Blink while invulnerable so the hit reads clearly.
  if (!(invuln > 0 && Math.floor(invuln * 12) % 2 === 0)) {
    drawSprite(SPRITES.player, player.x, player.y, invuln > 0 ? COLORS.playerHit : COLORS.player)
  }

  ctx.restore()
}

const loop = (timestamp) => {
  frameId = requestAnimationFrame(loop)

  if (state.value !== 'playing') {
    lastTime = timestamp
    return
  }

  // Clamp so a background tab or a slow frame cannot teleport everything.
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
  lastTime = timestamp

  update(dt)
  render()
}

const resetGame = () => {
  bullets = []
  enemies = []
  sparks = []
  player.x = WIDTH / 2
  player.y = HEIGHT / 2
  score.value = 0
  wave.value = 1
  health.value = MAX_HEALTH
  spawnTimer = 0.6
  waveTimer = 0
  fireTimer = 0
  invuln = 0
  shake = 0
  touchTarget = null
  isNewBest.value = false
}

const startGame = () => {
  resetGame()
  state.value = 'playing'
}

const primaryAction = () => {
  if (state.value === 'paused') {
    state.value = 'playing'
    return
  }
  startGame()
}

const togglePause = () => {
  if (state.value === 'playing') {
    state.value = 'paused'
  } else if (state.value === 'paused') {
    state.value = 'playing'
  }
}

const GAME_KEYS = new Set([
  'w', 'a', 's', 'd',
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
  ' '
])

const handleKeydown = (event) => {
  const key = event.key.toLowerCase()

  if (key === 'escape' || key === 'p') {
    togglePause()
    return
  }

  if (key === 'enter' && state.value !== 'playing') {
    event.preventDefault()
    primaryAction()
    return
  }

  if (state.value === 'playing' && GAME_KEYS.has(key)) {
    // Stop space and the arrows from scrolling the page mid-game.
    event.preventDefault()
  }

  if (key === ' ') {
    firing = true
    return
  }

  keys.add(key)
}

const handleKeyup = (event) => {
  const key = event.key.toLowerCase()

  if (key === ' ') {
    firing = false
    return
  }

  keys.delete(key)
}

const toLogical = (event) => {
  const rect = canvasEl.value.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * HEIGHT
  }
}

const handlePointerMove = (event) => {
  const point = toLogical(event)

  if (event.pointerType === 'touch') {
    touchTarget = point
    return
  }

  aim.mode = 'mouse'
  aim.x = point.x
  aim.y = point.y
}

const handlePointerDown = (event) => {
  if (state.value !== 'playing') {
    return
  }

  canvasEl.value.setPointerCapture?.(event.pointerId)

  if (event.pointerType === 'touch') {
    touchTarget = toLogical(event)
    return
  }

  aim.mode = 'mouse'
  const point = toLogical(event)
  aim.x = point.x
  aim.y = point.y
  firing = true
}

const handlePointerUp = (event) => {
  if (event.pointerType === 'touch') {
    touchTarget = null
    return
  }
  firing = false
}

const handleVisibility = () => {
  if (document.hidden && state.value === 'playing') {
    state.value = 'paused'
  }
}

// A palette opened over the game should not let bugs keep closing in.
watch(paletteOpen, (open) => {
  if (open && state.value === 'playing') {
    state.value = 'paused'
  }
})

onMounted(() => {
  ctx = canvasEl.value.getContext('2d')
  ctx.imageSmoothingEnabled = false

  render()

  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)
  document.addEventListener('visibilitychange', handleVisibility)

  const canvas = canvasEl.value
  canvas.addEventListener('pointermove', handlePointerMove)
  canvas.addEventListener('pointerdown', handlePointerDown)
  window.addEventListener('pointerup', handlePointerUp)

  frameId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
  window.removeEventListener('pointerup', handlePointerUp)
  document.removeEventListener('visibilitychange', handleVisibility)

  const canvas = canvasEl.value
  canvas?.removeEventListener('pointermove', handlePointerMove)
  canvas?.removeEventListener('pointerdown', handlePointerDown)
})

defineExpose({ startGame })
</script>

<style lang="scss" scoped>
.arcade {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.arcade__hud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  strong {
    color: $primary-blue;
    font-size: 1rem;
  }
}

.hud__hearts {
  display: flex;
  gap: 0.35rem;
  margin-left: auto;
}

.heart {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #f87171;
  box-shadow: 0 0 8px rgba(248, 113, 113, 0.5);

  &--lost {
    background: var(--bg-tertiary);
    box-shadow: none;
  }
}

.arcade__stage {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba($primary-blue, 0.35);
  box-shadow: 0 16px 40px var(--shadow-color);
  background: #0b1120;
  aspect-ratio: 3 / 2;
}

.arcade__canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  touch-action: none;
  cursor: crosshair;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(11, 17, 32, 0.82);
}

.overlay__panel {
  max-width: 380px;
  text-align: center;
  color: #e2e8f0;

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1.6rem;
    color: $accent-blue;
  }

  p {
    margin: 0 0 1rem;
    color: #94a3b8;
    line-height: 1.6;
    font-size: 0.95rem;
  }
}

.overlay__score {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  color: #e2e8f0 !important;

  strong {
    color: $accent-blue;
    font-size: 1.2rem;
  }
}

.overlay__best {
  display: block;
  margin-top: 0.35rem;
  color: #4ade80;
  font-weight: 600;
}

.overlay__btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px $shadow-color-button;
  }
}

.arcade__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.6rem 1.5rem;
  margin: 1.25rem 0 0;

  div {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }

  dt {
    flex-shrink: 0;
    padding: 0.15rem 0.5rem;
    border: 1px solid var(--bg-tertiary);
    border-radius: 6px;
    color: var(--text-primary);
    font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 0.75rem;
  }

  dd {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
}

.arcade__touch-hint {
  margin: 0.85rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  text-align: center;
}

@include mobile {
  .arcade__hud {
    gap: 0.9rem;
    font-size: 0.75rem;
  }

  .hud__hearts {
    margin-left: 0;
  }

  .overlay__panel h3 {
    font-size: 1.3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .overlay__btn:hover {
    transform: none;
  }
}
</style>
