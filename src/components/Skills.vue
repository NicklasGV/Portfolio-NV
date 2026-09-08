<template>
  <section id="skills" class="section skills">
    <div class="container">
      <h2 class="section-title">{{ t.skills.title }}</h2>
      <p class="skills-subtitle">{{ t.skills.subtitle }}</p>

      <div class="skills-grid">
        <div class="skill-group" v-for="group in t.skills.groups" :key="group.title">
          <h3 class="group-title">{{ group.title }}</h3>
          <p class="group-description">{{ group.description }}</p>
          <ul class="tag-list">
            <li v-for="item in group.items" :key="item" class="tag">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
</script>

<style lang="scss" scoped>
.skills {
  padding: 80px 2rem;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.container {
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.skills-subtitle {
  max-width: 620px;
  margin: -1.5rem auto 3rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.7;
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.skill-group {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px var(--shadow-color-hover);
  }
}

.group-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.group-description {
  margin: 0 0 1.5rem;
  color: var(--text-tertiary);
  font-size: 0.92rem;
  line-height: 1.6;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 0.35rem 0.8rem;
  border: 1px solid rgba($primary-blue, 0.3);
  border-radius: 999px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.85rem;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
}

@include tablet-down {
  .skills {
    padding: 70px 1.5rem;
  }
}

@include mobile {
  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .skill-group {
    padding: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-group:hover {
    transform: none;
  }
}
</style>
