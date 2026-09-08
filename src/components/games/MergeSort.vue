<template>
  <div class="merge">
    <div class="merge__hud">
      <span class="hud__item">{{ t.arcade.score }} <strong>{{ score }}</strong></span>
      <span class="hud__item">{{ t.arcade.best }} <strong>{{ best }}</strong></span>
      <button
        type="button"
        class="hud__btn"
        :disabled="!snapshot"
        @click="undo"
      >
        {{ t.arcade.mergeSort.undo }}
      </button>
      <button type="button" class="hud__btn" @click="startGame">
        {{ t.arcade.mergeSort.newGame }}
      </button>
    </div>

    <div
      ref="boardEl"
      class="board"
      tabindex="0"
      role="application"
      :aria-label="t.arcade.mergeSort.boardLabel"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @keydown="onKeydown"
    >
      <div class="board__cells" aria-hidden="true">
        <span v-for="i in 16" :key="i" class="cell"></span>
      </div>

      <div class="board__tiles">
        <div
          v-for="tile in tiles"
          :key="tile.id"
          class="tile"
          :class="[
            `tile--${tile.value > 2048 ? 'max' : tile.value}`,
            { 'tile--new': tile.isNew, 'tile--merged': tile.justMerged, 'tile--long': String(tile.value).length > 3 }
          ]"
          :style="{ '--row': tile.row, '--col': tile.col }"
        >
          {{ tile.value }}
        </div>
      </div>

      <div v-if="status" class="overlay">
        <div class="overlay__panel">
          <h3>{{ status === 'won' ? t.arcade.mergeSort.wonTitle : t.arcade.overTitle }}</h3>
          <p class="overlay__score">
            {{ t.arcade.score }} <strong>{{ score }}</strong>
            <span v-if="isNewBest" class="overlay__best">{{ t.arcade.newBest }}</span>
          </p>
          <p>{{ status === 'won' ? t.arcade.mergeSort.wonBody : t.arcade.mergeSort.lostBody }}</p>
          <div class="overlay__actions">
            <button v-if="status === 'won'" type="button" class="overlay__btn" @click="keepGoing">
              {{ t.arcade.mergeSort.keepGoing }}
            </button>
            <button type="button" class="overlay__btn overlay__btn--ghost" @click="startGame">
              {{ t.arcade.again }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="merge__hint">{{ t.arcade.mergeSort.hint }}</p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLanguage } from '../../composables/useLanguage'
import { useHighScore } from '../../composables/useHighScore'

const { t } = useLanguage()
const { best, submit: submitScore } = useHighScore('merge-sort')

const SIZE = 4
const VECTORS = {
  left: [0, -1],
  right: [0, 1],
  up: [-1, 0],
  down: [1, 0]
}

const boardEl = ref(null)
const tiles = ref([])
const score = ref(0)
const status = ref(null)
const isNewBest = ref(false)
const snapshot = ref(null)

let nextId = 1
let keepPlaying = false
let cleanupTimer = null
let pointerStart = null

const emptyCells = () => {
  const taken = new Set(tiles.value.map((tile) => `${tile.row},${tile.col}`))
  const cells = []

  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (!taken.has(`${r},${c}`)) {
        cells.push({ row: r, col: c })
      }
    }
  }

  return cells
}

const addRandomTile = () => {
  const cells = emptyCells()
  if (!cells.length) {
    return
  }

  const { row, col } = cells[Math.floor(Math.random() * cells.length)]
  tiles.value.push({
    id: nextId++,
    value: Math.random() < 0.9 ? 2 : 4,
    row,
    col,
    isNew: true,
    justMerged: false
  })
}

const buildGrid = () => {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  tiles.value.forEach((tile) => {
    grid[tile.row][tile.col] = tile
  })
  return grid
}

// Tiles nearest the direction of travel must move first, or a tile can
// merge twice in one turn.
const traversalOrder = (dr, dc) => {
  const rows = [...Array(SIZE).keys()]
  const cols = [...Array(SIZE).keys()]

  if (dr > 0) rows.reverse()
  if (dc > 0) cols.reverse()

  const order = []
  rows.forEach((r) => cols.forEach((c) => order.push({ r, c })))
  return order
}

const canMove = () => {
  if (tiles.value.length < SIZE * SIZE) {
    return true
  }

  const grid = buildGrid()

  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const value = grid[r][c]?.value
      if (
        (r + 1 < SIZE && grid[r + 1][c]?.value === value) ||
        (c + 1 < SIZE && grid[r][c + 1]?.value === value)
      ) {
        return true
      }
    }
  }

  return false
}

const takeSnapshot = () => ({
  tiles: tiles.value.map((tile) => ({ ...tile, isNew: false, justMerged: false })),
  score: score.value
})

const undo = () => {
  if (!snapshot.value) {
    return
  }

  tiles.value = snapshot.value.tiles.map((tile) => ({ ...tile }))
  score.value = snapshot.value.score
  snapshot.value = null
  status.value = null
  boardEl.value?.focus()
}

const move = (direction) => {
  if (status.value) {
    return
  }

  const [dr, dc] = VECTORS[direction]
  const previous = takeSnapshot()
  const grid = buildGrid()
  const absorbed = []
  const mergedThisTurn = new Set()

  let moved = false
  let gained = 0

  tiles.value.forEach((tile) => {
    tile.isNew = false
    tile.justMerged = false
  })

  traversalOrder(dr, dc).forEach(({ r, c }) => {
    const tile = grid[r][c]
    if (!tile) {
      return
    }

    grid[r][c] = null
    let row = r
    let col = c

    for (;;) {
      const targetRow = row + dr
      const targetCol = col + dc

      if (targetRow < 0 || targetRow >= SIZE || targetCol < 0 || targetCol >= SIZE) {
        break
      }

      const occupant = grid[targetRow][targetCol]

      if (!occupant) {
        row = targetRow
        col = targetCol
        continue
      }

      if (occupant.value === tile.value && !mergedThisTurn.has(occupant.id)) {
        occupant.value *= 2
        occupant.justMerged = true
        mergedThisTurn.add(occupant.id)
        gained += occupant.value

        // Slide the absorbed tile onto the survivor, then drop it once the
        // transition has played, so the merge reads as two tiles becoming one.
        tile.row = targetRow
        tile.col = targetCol
        absorbed.push(tile.id)
        moved = true
        return
      }

      break
    }

    if (row !== r || col !== c) {
      moved = true
    }

    tile.row = row
    tile.col = col
    grid[row][col] = tile
  })

  if (!moved) {
    return
  }

  score.value += gained
  snapshot.value = previous
  addRandomTile()

  clearTimeout(cleanupTimer)
  cleanupTimer = setTimeout(() => {
    tiles.value = tiles.value.filter((tile) => !absorbed.includes(tile.id))
    tiles.value.forEach((tile) => {
      tile.justMerged = false
      tile.isNew = false
    })

    if (!keepPlaying && tiles.value.some((tile) => tile.value >= 2048)) {
      status.value = 'won'
      isNewBest.value = submitScore(score.value)
      return
    }

    if (!canMove()) {
      status.value = 'lost'
      isNewBest.value = submitScore(score.value)
    }
  }, 140)
}

const keepGoing = () => {
  keepPlaying = true
  status.value = null
  boardEl.value?.focus()
}

const startGame = () => {
  clearTimeout(cleanupTimer)
  tiles.value = []
  score.value = 0
  status.value = null
  isNewBest.value = false
  snapshot.value = null
  keepPlaying = false
  addRandomTile()
  addRandomTile()
  boardEl.value?.focus()
}

const KEY_MAP = {
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down'
}

const onKeydown = (event) => {
  const direction = KEY_MAP[event.key.toLowerCase()]
  if (!direction) {
    return
  }

  event.preventDefault()
  move(direction)
}

const onPointerDown = (event) => {
  pointerStart = { x: event.clientX, y: event.clientY }
}

const onPointerUp = (event) => {
  if (!pointerStart) {
    return
  }

  const dx = event.clientX - pointerStart.x
  const dy = event.clientY - pointerStart.y
  pointerStart = null

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) {
    return
  }

  move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
}

onMounted(() => {
  startGame()
})

onBeforeUnmount(() => {
  clearTimeout(cleanupTimer)
})
</script>

<style lang="scss" scoped>
.merge {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.merge__hud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 0.9rem;
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

.hud__btn {
  padding: 0.35rem 0.85rem;
  border: 1px solid rgba($primary-blue, 0.35);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  &:last-of-type {
    margin-left: auto;
  }

  &:hover:not(:disabled) {
    border-color: $primary-blue;
    color: $primary-blue;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.board {
  --gap: 3.2%;

  position: relative;
  aspect-ratio: 1;
  padding: var(--gap);
  border-radius: 14px;
  background: var(--bg-secondary);
  border: 1px solid rgba($primary-blue, 0.3);
  box-shadow: 0 16px 40px var(--shadow-color);
  touch-action: none;
  outline: none;

  &:focus-visible {
    border-color: $primary-blue;
    box-shadow: 0 0 0 3px rgba($primary-blue, 0.3);
  }
}

.board__cells {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: var(--gap);
  width: 100%;
  height: 100%;
}

.cell {
  border-radius: 8px;
  background: var(--bg-primary);
  opacity: 0.55;
}

.board__tiles {
  position: absolute;
  inset: var(--gap);
}

.tile {
  position: absolute;
  top: 0;
  left: 0;
  width: calc((100% - 3 * var(--gap)) / 4);
  height: calc((100% - 3 * var(--gap)) / 4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  font-size: clamp(1rem, 5.5vw, 1.75rem);
  color: #f8fafc;
  // 100% here is the tile's own width, which is exactly one column.
  transform: translate(
    calc(var(--col) * (100% + var(--gap))),
    calc(var(--row) * (100% + var(--gap)))
  );
  transition: transform 0.13s ease-in-out;

  &--long {
    font-size: clamp(0.8rem, 4vw, 1.3rem);
  }
}

.tile--2 { background: #334155; }
.tile--4 { background: #3b5a8f; }
.tile--8 { background: #2563eb; }
.tile--16 { background: #3b82f6; }
.tile--32 { background: #60a5fa; }
.tile--64 { background: #38bdf8; }
.tile--128 { background: #22d3ee; color: #0b1120; }
.tile--256 { background: #34d399; color: #0b1120; }
.tile--512 { background: #a3e635; color: #0b1120; }
.tile--1024 { background: #fbbf24; color: #0b1120; }
.tile--2048 { background: #fb923c; color: #0b1120; }
.tile--max { background: #f87171; }

.tile--new {
  animation: pop-in 0.16s ease-out;
}

.tile--merged {
  animation: pop 0.16s ease-out;
  z-index: 2;
}

@keyframes pop-in {
  from {
    opacity: 0;
    scale: 0.5;
  }
}

@keyframes pop {
  50% {
    scale: 1.14;
  }
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 14px;
  background: rgba(11, 17, 32, 0.88);
}

.overlay__panel {
  text-align: center;
  color: #e2e8f0;

  h3 {
    margin: 0 0 0.75rem;
    font-size: 1.5rem;
    color: $accent-blue;
  }

  p {
    margin: 0 0 1rem;
    color: #94a3b8;
    font-size: 0.92rem;
    line-height: 1.6;
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

.overlay__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
}

.overlay__btn {
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &--ghost {
    background: transparent;
    border: 1px solid rgba(148, 163, 184, 0.5);
    color: #e2e8f0;
  }

  &:hover {
    transform: translateY(-2px);
  }
}

.merge__hint {
  margin: 1.1rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.88rem;
  text-align: center;
}

@include mobile {
  .merge__hud {
    gap: 0.85rem;
    font-size: 0.72rem;
  }

  .hud__btn:last-of-type {
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tile {
    transition: none;
  }

  .tile--new,
  .tile--merged {
    animation: none;
  }

  .overlay__btn:hover {
    transform: none;
  }
}
</style>
