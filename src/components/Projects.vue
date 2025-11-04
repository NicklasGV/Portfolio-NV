<template>
  <section id="projects" class="section projects">
    <div class="container">
      <h2 class="section-title">{{ t.projects.title }}</h2>
      <div class="projects-grid">
        <div 
          class="project-card" 
          v-for="project in t.projects.items" 
          :key="project.title"
        >
          <div class="project-image">
            <div class="project-placeholder">
              <img
                :src="project.image"
                :alt="project.alt || project.title"
                loading="lazy"
                decoding="async"
                class="project-image-img"
              />
            </div>
          </div>
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description" v-html="project.description"></p>
            <div class="project-tags">
              <span 
                class="tag" 
                v-for="tag in project.tags" 
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="project-links">
              <a 
                v-if="project.github" 
                :href="project.github" 
                target="_blank" 
                class="project-link"
              >
                {{ t.projects.github }}
              </a>
              <a 
                v-if="project.demo" 
                :href="project.demo" 
                target="_blank" 
                class="project-link"
              >
                {{ t.projects.demo }}
              </a>
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
.projects {
  padding: 80px 2rem;
  background: var(--bg-secondary);
  transition: background-color 0.3s;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.project-image-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.project-card {
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 40px var(--shadow-color-hover);
  }
}

.project-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.project-placeholder {
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
}

.project-content {
  padding: 1.5rem;
}

.project-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.3rem;
  color: var(--text-primary);
}

.project-description {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;

  :deep(.highlight) {
    color: $primary-blue;
    font-weight: 600;
    border-radius: 4px;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  padding: 0.5rem 1.5rem;
  background: transparent;
  border: 2px solid $primary-blue;
  color: $primary-blue;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
    color: $text-white;
    transform: translateY(-2px);
  }
}

@include mobile {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
