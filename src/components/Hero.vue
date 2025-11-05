<template>
  <section id="hero" class="hero" ref="heroSection">
    <div class="hero__background" aria-hidden="true">
      <span class="cursor-glow"></span>
      <span class="orb orb--one"></span>
      <span class="orb orb--two"></span>
      <span class="orb orb--three"></span>
    </div>
    <div class="hero__content">
      <div class="text">
        <p class="eyebrow">{{ t.hero.eyebrow }}</p>
        <h1 v-html="t.hero.title"></h1>
        <p class="subtitle">{{ t.hero.subtitle }}</p>
        <div class="actions">
          <a href="#projects" class="cta primary">{{ t.hero.primaryCta }}</a>
          <a href="#contact" class="cta secondary">{{ t.hero.secondaryCta }}</a>
        </div>
        <ul v-if="t.hero.stats?.length" class="stats">
          <li v-for="stat in t.hero.stats" :key="stat.label" class="stat">
            <span class="value">{{ stat.value }}</span>
            <span class="label">{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

const heroSection = ref(null)
let frameId

const isFinePointer = () => (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

const setCursorPosition = (xPercent, yPercent) => {
  if (!heroSection.value) {
    return
  }

  heroSection.value.style.setProperty('--cursor-x', `${xPercent}%`)
  heroSection.value.style.setProperty('--cursor-y', `${yPercent}%`)
  heroSection.value.style.setProperty(
    '--cursor-opacity',
    isFinePointer() ? '1' : '0'
  )
}

const handlePointerMove = (event) => {
  if (!heroSection.value) {
    return
  }

  const rect = heroSection.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  cancelAnimationFrame(frameId)
  frameId = requestAnimationFrame(() => {
    setCursorPosition(Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y)))
  })
}

const handlePointerLeave = () => {
  cancelAnimationFrame(frameId)
  frameId = requestAnimationFrame(() => {
    setCursorPosition(50, 50)
    heroSection.value?.style.setProperty('--cursor-opacity', isFinePointer() ? '0.6' : '0')
  })
}

onMounted(() => {
  heroSection.value?.style.setProperty('--cursor-opacity', isFinePointer() ? '0.6' : '0')
  setCursorPosition(50, 50)
  heroSection.value?.addEventListener('pointermove', handlePointerMove)
  heroSection.value?.addEventListener('pointerleave', handlePointerLeave)
})

onBeforeUnmount(() => {
  heroSection.value?.removeEventListener('pointermove', handlePointerMove)
  heroSection.value?.removeEventListener('pointerleave', handlePointerLeave)
  cancelAnimationFrame(frameId)
})
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  padding: 200px 2rem 140px;
  background: var(--bg-secondary);
  overflow: hidden;
  color: var(--text-primary);
  transition: background-color 0.3s;
  --cursor-x: 50%;
  --cursor-y: 50%;
  --cursor-opacity: 0.6;
}

.hero__content {
  position: relative;
  max-width: $breakpoint-xl;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr);
  gap: 4rem;
  align-items: center;
  z-index: 1;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.eyebrow {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: $primary-blue;
}

h1 {
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.1;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);

  :deep(.highlight) {
    background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.subtitle {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  max-width: 40ch;
  margin: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.8rem;
  border-radius: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
  }
}

.cta.primary {
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  box-shadow: 0 10px 30px $shadow-color-strong;
}

.cta.secondary {
  border: 2px solid rgba($primary-blue, 0.5);
  color: $primary-blue;
  background: rgba($primary-blue, 0.05);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  padding: 0;
  margin: 1rem 0 0;
  list-style: none;
}

.stat {
  padding: 1.2rem;
  background: var(--overlay-light);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: float 8s ease-in-out infinite;
}

.stat:nth-child(2) {
  animation-delay: 2s;
}

.stat:nth-child(3) {
  animation-delay: 4s;
}

.value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

.label {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.hero__background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.cursor-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--cursor-x) var(--cursor-y),
    var(--glow-inner) 0%,
    var(--glow-middle) 45%,
    var(--glow-outer) 80%
  );
  opacity: var(--cursor-opacity);
  transition: opacity 0.45s ease;
  mix-blend-mode: var(--glow-blend-mode, screen);
}

.orb {
  position: absolute;
  width: clamp(180px, 25vw, 320px);
  height: clamp(180px, 25vw, 320px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba($gradient-start, 0.18) 0%, transparent 70%);
  opacity: 0.6;
  animation: float 14s ease-in-out infinite;
}

.orb--one {
  top: -12%;
  left: -8%;
}

.orb--two {
  bottom: -18%;
  right: -12%;
  animation-duration: 18s;
}

.orb--three {
  top: 45%;
  right: 48%;
  animation-duration: 20s;
}

@keyframes float {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -14px, 0);
  }
}

@include tablet-down {
  .hero {
    padding: 160px 1.5rem 120px;
  }

  .hero__content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .subtitle {
    max-width: 100%;
    margin: 0 auto;
  }

  .actions {
    justify-content: center;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }
}

@include mobile {
  .hero {
    padding: 140px 1.25rem 100px;
  }

  h1 {
    font-size: 2.4rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .orb {
    display: none;
  }
}
</style>

