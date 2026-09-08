<template>
  <Transition name="matrix-fade" :duration="400">
    <div
      v-if="isActive"
      class="matrix"
      role="presentation"
      @click="stop"
    >
      <canvas ref="canvasEl" class="matrix__canvas"></canvas>
      <p class="matrix__hint">{{ t.matrix.exitHint }}</p>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { useMatrixRain } from '../composables/useMatrixRain'

const { t } = useLanguage()
const { isActive, stop } = useMatrixRain()

const canvasEl = ref(null)
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>[]{}/\\=+*NVSQLVUE'

let frameId = null
let resizeObserver = null
let columns = []
let cellSize = 16
let lastFrame = 0

const setupColumns = (canvas) => {
  const { width, height } = canvas
  const columnCount = Math.ceil(width / cellSize)

  columns = Array.from({ length: columnCount }, () => ({
    y: Math.random() * height,
    speed: cellSize * (0.35 + Math.random() * 0.65)
  }))
}

const resizeCanvas = () => {
  const canvas = canvasEl.value
  if (!canvas) {
    return
  }

  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = window.innerWidth * ratio
  canvas.height = window.innerHeight * ratio
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`

  cellSize = (window.innerWidth < 768 ? 14 : 18) * ratio
  setupColumns(canvas)

  // Resizing resets the bitmap, so lay down an opaque base for the trails to fade into.
  const context = canvas.getContext('2d')
  if (context) {
    context.fillStyle = '#020617'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
}

const glyph = () => CHARS[Math.floor(Math.random() * CHARS.length)]

const applyFont = (context) => {
  context.font = `${cellSize}px "SFMono-Regular", Menlo, Consolas, monospace`
  context.textBaseline = 'top'
}

// Reduced-motion viewers get a full, frozen matrix screen instead of an animation.
const paintStatic = () => {
  const canvas = canvasEl.value
  const context = canvas?.getContext('2d')

  if (!canvas || !context) {
    return
  }

  applyFont(context)

  const rows = Math.ceil(canvas.height / cellSize)

  columns.forEach((column, index) => {
    const x = index * cellSize
    const head = Math.floor(Math.random() * rows)
    const trail = 6 + Math.floor(Math.random() * 14)

    for (let step = 0; step < trail; step += 1) {
      const row = head - step

      if (row < 0) {
        break
      }

      context.globalAlpha = step === 0 ? 1 : Math.max(0.08, 1 - step / trail)
      context.fillStyle = step === 0 ? '#bfdbfe' : '#3b82f6'
      context.fillText(glyph(), x, row * cellSize)
    }
  })

  context.globalAlpha = 1
}

const draw = (timestamp) => {
  const canvas = canvasEl.value
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  // Throttle to ~30fps; the effect reads better slightly stepped than buttery smooth.
  if (!lastFrame || timestamp - lastFrame > 33) {
    lastFrame = timestamp

    context.fillStyle = 'rgba(2, 6, 23, 0.09)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    applyFont(context)

    columns.forEach((column, index) => {
      const char = glyph()
      const x = index * cellSize

      context.fillStyle = '#bfdbfe'
      context.fillText(char, x, column.y)

      context.fillStyle = '#3b82f6'
      context.fillText(char, x, column.y - cellSize)

      column.y += column.speed

      if (column.y > canvas.height && Math.random() > 0.975) {
        column.y = -cellSize
      }
    })
  }

  frameId = requestAnimationFrame(draw)
}

const teardown = () => {
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = null
  }

  window.removeEventListener('resize', resizeCanvas)
  resizeObserver?.disconnect()
  resizeObserver = null
  columns = []
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    stop()
  }
}

watch(isActive, async (active) => {
  if (!active) {
    teardown()
    window.removeEventListener('keydown', handleKeydown)
    return
  }

  await nextTick()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', handleKeydown)

  // Fill the screen immediately so frame one is already a wall of rain,
  // then let the loop take over. This is an effect you opt into by name,
  // so it animates regardless of the reduced-motion preference.
  paintStatic()

  lastFrame = 0
  frameId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  teardown()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.matrix {
  position: fixed;
  inset: 0;
  z-index: 4000;
  background: #020617;
  cursor: pointer;
}

.matrix__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.matrix__hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba($accent-blue, 0.4);
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.75);
  color: $accent-blue-light;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.matrix-fade-enter-active,
.matrix-fade-leave-active {
  transition: opacity 0.4s ease;
}

.matrix-fade-leave-active {
  pointer-events: none;
}

.matrix-fade-enter-from,
.matrix-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .matrix-fade-enter-active,
  .matrix-fade-leave-active {
    transition: none;
  }
}
</style>
