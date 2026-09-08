<template>
  <div class="stack">
    <div class="stack__hud">
      <span class="hud__item">{{ t.arcade.score }} <strong>{{ score }}</strong></span>
      <span class="hud__item">{{ t.arcade.stackOverflow.lines }} <strong>{{ lines }}</strong></span>
      <span class="hud__item">{{ t.arcade.stackOverflow.level }} <strong>{{ level }}</strong></span>
      <span class="hud__item">{{ t.arcade.best }} <strong>{{ best }}</strong></span>
    </div>

    <div class="stack__layout">
      <div ref="stageEl" class="stack__stage">
        <canvas
          ref="canvasEl"
          class="stack__canvas"
          :width="COLS * CELL"
          :height="ROWS * CELL"
          role="img"
          :aria-label="t.arcade.stackOverflow.canvasLabel"
        ></canvas>

        <div v-if="state !== 'playing'" class="overlay">
          <div class="overlay__panel">
            <h3>{{ overlayCopy.title }}</h3>
            <p v-if="state === 'over'" class="overlay__score">
              {{ t.arcade.score }} <strong>{{ score }}</strong>
              <span v-if="isNewBest" class="overlay__best">{{ t.arcade.newBest }}</span>
            </p>
            <p>{{ overlayCopy.body }}</p>
            <button type="button" class="overlay__btn" @click="primaryAction">
              {{ overlayCopy.button }}
            </button>
          </div>
        </div>
      </div>

      <aside class="stack__side">
        <div class="side__box">
          <h4>{{ t.arcade.stackOverflow.next }}</h4>
          <canvas ref="nextEl" class="side__canvas" width="96" height="72"></canvas>
        </div>
        <div class="side__box">
          <h4>{{ t.arcade.stackOverflow.hold }}</h4>
          <canvas ref="holdEl" class="side__canvas" width="96" height="72"></canvas>
        </div>
      </aside>
    </div>

    <div class="touch-pad">
      <button type="button" @click="press('left')" aria-label="Left">←</button>
      <button type="button" @click="press('rotate')" aria-label="Rotate">↻</button>
      <button type="button" @click="press('right')" aria-label="Right">→</button>
      <button type="button" @click="press('soft')" aria-label="Soft drop">↓</button>
      <button type="button" @click="press('hard')" aria-label="Hard drop">⤓</button>
    </div>

    <dl class="stack__controls">
      <div><dt>← →</dt><dd>{{ t.arcade.stackOverflow.controls.move }}</dd></div>
      <div><dt>↑ / X</dt><dd>{{ t.arcade.stackOverflow.controls.rotate }}</dd></div>
      <div><dt>↓</dt><dd>{{ t.arcade.stackOverflow.controls.soft }}</dd></div>
      <div><dt>Space</dt><dd>{{ t.arcade.stackOverflow.controls.hard }}</dd></div>
      <div><dt>C</dt><dd>{{ t.arcade.stackOverflow.controls.hold }}</dd></div>
      <div><dt>Esc / P</dt><dd>{{ t.arcade.controls.pause }}</dd></div>
    </dl>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLanguage } from '../../composables/useLanguage'
import { useCommandPalette } from '../../composables/useCommandPalette'
import { useHighScore } from '../../composables/useHighScore'

const { t } = useLanguage()
const { isOpen: paletteOpen } = useCommandPalette()
const { best, submit: submitScore } = useHighScore('stack-overflow')

const COLS = 10
const ROWS = 20
const CELL = 24

const canvasEl = ref(null)
const nextEl = ref(null)
const holdEl = ref(null)

const state = ref('idle')
const score = ref(0)
const lines = ref(0)
const level = ref(1)
const isNewBest = ref(false)

const PIECES = {
  I: { color: '#38bdf8', cells: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  O: { color: '#fbbf24', cells: [[1, 1], [1, 1]] },
  T: { color: '#a78bfa', cells: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  S: { color: '#4ade80', cells: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  Z: { color: '#f87171', cells: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  J: { color: '#60a5fa', cells: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { color: '#fb923c', cells: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] }
}

const LINE_SCORES = [0, 100, 300, 500, 800]

let ctx = null
let board = []
let current = null
let nextPiece = null
let holdPiece = null
let holdUsed = false
let bag = []
let frameId = null
let lastTime = 0
let dropAccumulator = 0

const overlayCopy = computed(() => {
  const copy = t.value.arcade
  if (state.value === 'paused') {
    return { title: copy.pausedTitle, body: copy.pausedBody, button: copy.resume }
  }
  if (state.value === 'over') {
    return { title: copy.overTitle, body: copy.stackOverflow.overBody, button: copy.again }
  }
  return { title: copy.stackOverflow.title, body: copy.stackOverflow.readyBody, button: copy.start }
})

// Gravity gets faster per level but never faster than the player can react.
const dropInterval = () => Math.max(90, 800 - (level.value - 1) * 65)

const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null))

// 7-bag randomiser: every piece appears once per bag, so you never get
// starved of an I-piece the way pure random allows.
const nextFromBag = () => {
  if (!bag.length) {
    bag = Object.keys(PIECES)
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[bag[i], bag[j]] = [bag[j], bag[i]]
    }
  }
  return bag.pop()
}

const makePiece = (type) => ({
  type,
  color: PIECES[type].color,
  cells: PIECES[type].cells.map((row) => [...row]),
  row: 0,
  col: Math.floor((COLS - PIECES[type].cells[0].length) / 2)
})

const collides = (piece, rowOffset = 0, colOffset = 0, cells = piece.cells) => {
  for (let r = 0; r < cells.length; r += 1) {
    for (let c = 0; c < cells[r].length; c += 1) {
      if (!cells[r][c]) {
        continue
      }

      const row = piece.row + r + rowOffset
      const col = piece.col + c + colOffset

      if (col < 0 || col >= COLS || row >= ROWS) {
        return true
      }
      if (row >= 0 && board[row][col]) {
        return true
      }
    }
  }
  return false
}

const rotateCells = (cells) => cells[0].map((_, i) => cells.map((row) => row[i]).reverse())

const rotate = () => {
  if (!current || current.type === 'O') {
    return
  }

  const rotated = rotateCells(current.cells)

  // Basic wall kicks: try in place, then nudge sideways before giving up.
  for (const offset of [0, -1, 1, -2, 2]) {
    if (!collides(current, 0, offset, rotated)) {
      current.cells = rotated
      current.col += offset
      return
    }
  }
}

const move = (delta) => {
  if (current && !collides(current, 0, delta)) {
    current.col += delta
  }
}

const lockPiece = () => {
  current.cells.forEach((row, r) => {
    row.forEach((filled, c) => {
      if (!filled) {
        return
      }
      const boardRow = current.row + r
      if (boardRow >= 0) {
        board[boardRow][current.col + c] = current.color
      }
    })
  })

  const remaining = board.filter((row) => row.some((cell) => !cell))
  const cleared = ROWS - remaining.length

  if (cleared) {
    board = [
      ...Array.from({ length: cleared }, () => Array(COLS).fill(null)),
      ...remaining
    ]
    lines.value += cleared
    score.value += LINE_SCORES[cleared] * level.value
    level.value = Math.floor(lines.value / 10) + 1
  }

  holdUsed = false
  spawn()
}

const spawn = () => {
  current = nextPiece ?? makePiece(nextFromBag())
  nextPiece = makePiece(nextFromBag())

  if (collides(current)) {
    state.value = 'over'
    isNewBest.value = submitScore(score.value)
  }
}

const softDrop = () => {
  if (!current) {
    return
  }

  if (collides(current, 1)) {
    lockPiece()
  } else {
    current.row += 1
    score.value += 1
  }
}

const hardDrop = () => {
  if (!current) {
    return
  }

  let distance = 0
  while (!collides(current, distance + 1)) {
    distance += 1
  }

  current.row += distance
  score.value += distance * 2
  lockPiece()
}

const hold = () => {
  if (!current || holdUsed) {
    return
  }

  const stored = holdPiece
  holdPiece = makePiece(current.type)

  if (stored) {
    current = stored
    current.row = 0
    current.col = Math.floor((COLS - stored.cells[0].length) / 2)
  } else {
    current = nextPiece
    nextPiece = makePiece(nextFromBag())
  }

  holdUsed = true
}

const ghostDistance = () => {
  let distance = 0
  while (!collides(current, distance + 1)) {
    distance += 1
  }
  return distance
}

const drawCell = (context, col, row, color, size = CELL, alpha = 1) => {
  context.globalAlpha = alpha
  context.fillStyle = color
  context.fillRect(col * size, row * size, size - 1, size - 1)

  // A lighter top edge gives the blocks a bit of depth without a sprite.
  context.fillStyle = 'rgba(255, 255, 255, 0.22)'
  context.fillRect(col * size, row * size, size - 1, 2)
  context.globalAlpha = 1
}

const render = () => {
  ctx.fillStyle = '#0b1120'
  ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)

  ctx.fillStyle = 'rgba(59, 130, 246, 0.08)'
  for (let c = 1; c < COLS; c += 1) {
    ctx.fillRect(c * CELL, 0, 1, ROWS * CELL)
  }
  for (let r = 1; r < ROWS; r += 1) {
    ctx.fillRect(0, r * CELL, COLS * CELL, 1)
  }

  board.forEach((row, r) => {
    row.forEach((color, c) => {
      if (color) {
        drawCell(ctx, c, r, color)
      }
    })
  })

  if (current && state.value !== 'over') {
    const ghost = ghostDistance()

    current.cells.forEach((row, r) => {
      row.forEach((filled, c) => {
        if (!filled) {
          return
        }
        if (ghost > 0) {
          drawCell(ctx, current.col + c, current.row + r + ghost, current.color, CELL, 0.18)
        }
        drawCell(ctx, current.col + c, current.row + r, current.color)
      })
    })
  }
}

const renderPreview = (canvas, piece) => {
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  context.fillStyle = '#0b1120'
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (!piece) {
    return
  }

  const size = 16
  const rows = piece.cells.length
  const cols = piece.cells[0].length
  const offsetX = (canvas.width - cols * size) / 2
  const offsetY = (canvas.height - rows * size) / 2

  context.save()
  context.translate(offsetX, offsetY)
  piece.cells.forEach((row, r) => {
    row.forEach((filled, c) => {
      if (filled) {
        drawCell(context, c, r, piece.color, size)
      }
    })
  })
  context.restore()
}

const renderSidebars = () => {
  renderPreview(nextEl.value, nextPiece)
  renderPreview(holdEl.value, holdPiece)
}

const loop = (timestamp) => {
  frameId = requestAnimationFrame(loop)

  if (state.value !== 'playing') {
    lastTime = timestamp
    return
  }

  const dt = Math.min(timestamp - lastTime, 250)
  lastTime = timestamp
  dropAccumulator += dt

  while (dropAccumulator >= dropInterval() && state.value === 'playing') {
    dropAccumulator -= dropInterval()
    if (collides(current, 1)) {
      lockPiece()
    } else {
      current.row += 1
    }
  }

  render()
  renderSidebars()
}

const reset = () => {
  board = emptyBoard()
  bag = []
  current = null
  nextPiece = null
  holdPiece = null
  holdUsed = false
  score.value = 0
  lines.value = 0
  level.value = 1
  isNewBest.value = false
  dropAccumulator = 0
  spawn()
}

const startGame = () => {
  reset()
  state.value = 'playing'
  render()
  renderSidebars()
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

const press = (action) => {
  if (state.value !== 'playing') {
    return
  }

  if (action === 'left') move(-1)
  if (action === 'right') move(1)
  if (action === 'rotate') rotate()
  if (action === 'soft') softDrop()
  if (action === 'hard') hardDrop()

  render()
  renderSidebars()
}

const HANDLED = new Set(['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'x', 'c'])

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

  if (state.value !== 'playing') {
    return
  }

  if (HANDLED.has(key)) {
    event.preventDefault()
  }

  if (key === 'arrowleft') move(-1)
  else if (key === 'arrowright') move(1)
  else if (key === 'arrowup' || key === 'x') rotate()
  else if (key === 'arrowdown') softDrop()
  else if (key === ' ') hardDrop()
  else if (key === 'c') hold()
  else return

  render()
  renderSidebars()
}

const handleVisibility = () => {
  if (document.hidden && state.value === 'playing') {
    state.value = 'paused'
  }
}

watch(paletteOpen, (open) => {
  if (open && state.value === 'playing') {
    state.value = 'paused'
  }
})

onMounted(() => {
  ctx = canvasEl.value.getContext('2d')
  board = emptyBoard()
  render()
  renderSidebars()

  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('visibilitychange', handleVisibility)
  frameId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<style lang="scss" scoped>
.stack {
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}

.stack__hud {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  strong {
    color: $primary-blue;
    font-size: 1rem;
  }
}

.stack__layout {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.stack__stage {
  position: relative;
  flex: 0 1 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba($primary-blue, 0.35);
  box-shadow: 0 16px 40px var(--shadow-color);
  background: #0b1120;
}

.stack__canvas {
  display: block;
  width: 100%;
  height: auto;
  max-height: 70vh;
  image-rendering: pixelated;
}

.stack__side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-shrink: 0;
}

.side__box {
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba($primary-blue, 0.25);
  background: var(--bg-secondary);

  h4 {
    margin: 0 0 0.5rem;
    color: var(--text-tertiary);
    font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}

.side__canvas {
  display: block;
  border-radius: 6px;
  image-rendering: pixelated;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(11, 17, 32, 0.85);
}

.overlay__panel {
  text-align: center;
  color: #e2e8f0;

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1.4rem;
    color: $accent-blue;
  }

  p {
    margin: 0 0 1rem;
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.6;
  }
}

.overlay__score {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  color: #e2e8f0 !important;

  strong {
    color: $accent-blue;
    font-size: 1.15rem;
  }
}

.overlay__best {
  display: block;
  margin-top: 0.35rem;
  color: #4ade80;
  font-weight: 600;
}

.overlay__btn {
  padding: 0.7rem 1.75rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px $shadow-color-button;
  }
}

.touch-pad {
  display: none;
  gap: 0.5rem;
  margin-top: 1rem;

  button {
    flex: 1;
    padding: 0.9rem 0;
    border: 1px solid rgba($primary-blue, 0.35);
    border-radius: 10px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 1.2rem;
    cursor: pointer;
    touch-action: manipulation;

    &:active {
      background: rgba($primary-blue, 0.2);
    }
  }
}

.stack__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.55rem 1.25rem;
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
    font-size: 0.72rem;
  }

  dd {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.88rem;
  }
}

@include tablet-down {
  .touch-pad {
    display: flex;
  }
}

@include mobile {
  .stack__layout {
    gap: 0.75rem;
  }

  .stack__side {
    gap: 0.6rem;
  }

  .side__canvas {
    width: 64px;
    height: 48px;
  }

  .stack__hud {
    gap: 0.85rem;
    font-size: 0.72rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .overlay__btn:hover {
    transform: none;
  }
}
</style>
