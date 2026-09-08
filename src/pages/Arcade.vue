<template>
  <div class="arcade-page">
    <div class="container">
      <RouterLink :to="activeGame ? '/arcade' : '/'" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {{ activeGame ? t.arcade.backToArcade : t.arcade.back }}
      </RouterLink>

      <template v-if="activeGame">
        <header class="arcade-page__head">
          <p class="eyebrow">{{ t.arcade.eyebrow }}</p>
          <h1>{{ t.arcade.games[activeGame.key].name }}</h1>
          <p class="lead">{{ t.arcade.games[activeGame.key].tagline }}</p>
        </header>

        <component :is="activeGame.component" :key="activeGame.slug" />

        <p class="arcade-page__foot">{{ t.arcade.games[activeGame.key].builtWith }}</p>
      </template>

      <template v-else>
        <header class="arcade-page__head">
          <p class="eyebrow">{{ t.arcade.eyebrow }}</p>
          <h1>{{ t.arcade.title }}</h1>
          <p class="lead">{{ t.arcade.subtitle }}</p>
        </header>

        <ul class="game-grid">
          <li v-for="game in GAMES" :key="game.slug">
            <RouterLink :to="`/arcade/${game.slug}`" class="game-card">
              <span class="game-card__art" aria-hidden="true" :class="`art--${game.key}`">
                <span v-for="i in 9" :key="i"></span>
              </span>
              <h2>{{ t.arcade.games[game.key].name }}</h2>
              <p>{{ t.arcade.games[game.key].tagline }}</p>
              <span class="game-card__cta">{{ t.arcade.play }} →</span>
            </RouterLink>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BugHunt from '../components/games/BugHunt.vue'
import StackOverflow from '../components/games/StackOverflow.vue'
import MergeSort from '../components/games/MergeSort.vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const route = useRoute()

const GAMES = [
  { slug: 'bug-hunt', key: 'bugHunt', component: BugHunt },
  { slug: 'stack-overflow', key: 'stackOverflow', component: StackOverflow },
  { slug: 'merge-sort', key: 'mergeSort', component: MergeSort }
]

const activeGame = computed(() => GAMES.find((game) => game.slug === route.params.slug) ?? null)
</script>

<style lang="scss" scoped>
.arcade-page {
  min-height: 100vh;
  padding: 4rem 2rem 5rem;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  color: var(--accent);
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
    color: var(--accent-hover);
  }
}

.arcade-page__head {
  margin-bottom: 2.5rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--accent);
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
  max-width: 580px;
  margin: 0 auto;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.game-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.75rem;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 1px solid transparent;
  box-shadow: 0 4px 20px var(--shadow-color);
  text-decoration: none;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;

  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: var(--text-primary);
  }

  p {
    flex: 1;
    margin: 0 0 1.25rem;
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba($primary-blue, 0.45);
    box-shadow: 0 12px 34px var(--shadow-color-hover);
  }
}

.game-card__art {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 54px;
  margin-bottom: 1.25rem;

  span {
    aspect-ratio: 1;
    border-radius: 3px;
    background: var(--bg-tertiary);
  }
}

// Each card gets a different lit pattern, so they read as three machines.
.art--bugHunt span:nth-child(2),
.art--bugHunt span:nth-child(4),
.art--bugHunt span:nth-child(6),
.art--bugHunt span:nth-child(8) {
  background: #f87171;
}

.art--stackOverflow span:nth-child(1),
.art--stackOverflow span:nth-child(2),
.art--stackOverflow span:nth-child(4),
.art--stackOverflow span:nth-child(5) {
  background: $accent-blue;
}

.art--mergeSort span:nth-child(3),
.art--mergeSort span:nth-child(5),
.art--mergeSort span:nth-child(7),
.art--mergeSort span:nth-child(9) {
  background: #fbbf24;
}

.game-card__cta {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.92rem;
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

  .game-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link:hover,
  .game-card:hover {
    gap: 0.5rem;
    transform: none;
  }
}
</style>
