<template>
  <section id="skills" class="section skills">
    <div class="container">
      <h2 class="section-title">{{ t.skills.title }}</h2>
      <div class="skills-grid">
        <div class="skill-category" v-for="category in t.skills.categories" :key="category.title">
          <h3 class="category-title">{{ category.title }}</h3>
          <div class="skills-list">
            <div 
              class="skill-item" 
              v-for="skill in category.skills" 
              :key="skill.name"
            >
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-bar">
                <div 
                  class="skill-progress" 
                  :style="{ width: skill.level + '%' }"
                ></div>
              </div>
              <span class="skill-percentage">{{ skill.level }}%</span>
            </div>
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
.skills {
  padding: 80px 2rem;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.skill-category {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

.category-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: var(--text-primary);
  text-align: center;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-item {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  gap: 1rem;
  align-items: center;
}

.skill-name {
  font-weight: 500;
  color: var(--text-primary);
}

.skill-bar {
  height: 10px;
  background: $border-light;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  border-radius: 10px;
  transition: width 1s ease-out;
  animation: fillBar 1.5s ease-out;
}

@keyframes fillBar {
  from {
    width: 0;
  }
}

.skill-percentage {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: right;
}

@include mobile {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-item {
    grid-template-columns: 100px 1fr 45px;
    gap: 0.5rem;
  }
}
</style>
