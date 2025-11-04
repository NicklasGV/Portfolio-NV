<template>
  <div class="not-found">
    <main class="panel" aria-labelledby="not-found-title">
      <p class="status" aria-hidden="true">404</p>
      <h1 id="not-found-title">That page went missing.</h1>
      <p class="description">
        Double-check the address or head back to the homepage.
      </p>
      <RouterLink to="/" class="primary">Return home</RouterLink>
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4rem);
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: rgba($text-white, 0.92);
  text-align: center;
}

.panel {
  display: grid;
  gap: 1.5rem;
  padding: clamp(2rem, 6vw, 3rem);
  max-width: 28rem;
  border-radius: 24px;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.45);
}

.status {
  margin: 0;
  font-size: clamp(2.75rem, 10vw, 4.5rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba($text-white, 0.6);
}

h1 {
  margin: 0;
  font-size: clamp(1.85rem, 5vw, 2.75rem);
  font-weight: 600;
}

.description {
  margin: 0;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  line-height: 1.6;
  color: rgba($text-white, 0.7);
}

.primary {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  color: var(--bg-primary);
  background: var(--text-primary);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary:hover,
.primary:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45);
}

@media (max-width: $breakpoint-sm) {
  .panel {
    gap: 1.25rem;
    border-radius: 20px;
  }
}

:deep(:root.dark) .not-found {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

:deep(:root.dark) .panel {
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

:deep(:root.dark) .primary {
  color: rgba(15, 23, 42, 0.95);
  background: rgba(255, 255, 255, 0.9);
}
</style>

