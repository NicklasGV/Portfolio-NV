<template>
  <section id="education" class="section education">
    <div class="container">
      <h2 class="section-title">{{ t.education.title }}</h2>
      <div class="timeline">
        <div class="timeline-item" v-for="(item, index) in t.education.timeline" :key="index">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-year">{{ item.year }}</div>
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-description">{{ item.description }}</p>
          </div>
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
.education {
  padding: 80px 2rem;
  background: var(--bg-secondary);
  transition: background-color 0.3s;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, $gradient-start 0%, $gradient-end 100%);
  }
}

.timeline-item {
  position: relative;
  padding-left: 80px;
  margin-bottom: 3rem;
}

.timeline-marker {
  position: absolute;
  left: 21px;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  border: 4px solid var(--bg-primary);
  box-shadow: 0 0 0 4px var(--shadow-color);
}

.timeline-content {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px var(--shadow-color-hover);
  }
}

.timeline-year {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.timeline-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.timeline-description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

@include mobile {
  .timeline::before {
    left: 15px;
  }

  .timeline-item {
    padding-left: 50px;
  }

  .timeline-marker {
    left: 6px;
  }
}
</style>
