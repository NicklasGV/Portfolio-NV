<template>
  <div class="arcade-page">
    <div class="container">
      <RouterLink to="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {{ t.arcade.back }}
      </RouterLink>

      <header class="arcade-page__head">
        <p class="eyebrow">{{ t.arcade.eyebrow }}</p>
        <h1>{{ t.arcade.title }}</h1>
        <p class="lead">{{ t.arcade.subtitle }}</p>
      </header>

      <ArcadeGame />

      <p class="arcade-page__foot">{{ t.arcade.builtWith }}</p>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ArcadeGame from '../components/ArcadeGame.vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
</script>

<style lang="scss" scoped>
.arcade-page {
  min-height: 100vh;
  padding: 4rem 2rem 5rem;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.container {
  max-width: 860px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  color: $primary-blue;
  font-weight: 500;
  text-decoration: none;
  transition: gap 0.2s, color 0.2s;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  &:hover {
    gap: 0.75rem;
    color: $secondary-blue;
  }
}

.arcade-page__head {
  margin-bottom: 2.5rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: $primary-blue;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lead {
  max-width: 560px;
  margin: 0 auto;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
}

.arcade-page__foot {
  margin: 2.5rem 0 0;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  text-align: center;
}

@include mobile {
  .arcade-page {
    padding: 3rem 1.25rem 4rem;
  }

  .back-link {
    margin-bottom: 1.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link:hover {
    gap: 0.5rem;
  }
}
</style>
