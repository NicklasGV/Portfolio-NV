<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-brand">
        <h1>Portfolio</h1>
      </div>
      <ul class="nav-links">
        <li><a href="#about" @click="scrollTo('about')">{{ t.nav.about }}</a></li>
        <li><a href="#education" @click="scrollTo('education')">{{ t.nav.education }}</a></li>
        <li><a href="#skills" @click="scrollTo('skills')">{{ t.nav.skills }}</a></li>
        <li><a href="#work-experience" @click="scrollTo('work-experience')">{{ t.nav.workExperience }}</a></li>
        <li><a href="#projects" @click="scrollTo('projects')">{{ t.nav.projects }}</a></li>
        <li><a href="#contact" @click="scrollTo('contact')">{{ t.nav.contact }}</a></li>
      </ul>
      <div class="nav-right">
        <button class="dark-mode-toggle" @click="toggleDarkMode" :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDarkMode" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button class="language-toggle" @click="toggleLanguage">
          {{ language === 'en' ? 'DA' : 'EN' }}
        </button>
        <button class="mobile-menu-toggle" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    <ul class="nav-links mobile" :class="{ active: mobileMenuOpen }">
      <li><a href="#about" @click="scrollTo('about')">{{ t.nav.about }}</a></li>
      <li><a href="#education" @click="scrollTo('education')">{{ t.nav.education }}</a></li>
      <li><a href="#skills" @click="scrollTo('skills')">{{ t.nav.skills }}</a></li>
      <li><a href="#workExperience" @click="scrollTo('workExperience')">{{ t.nav.workExperience }}</a></li>
      <li><a href="#projects" @click="scrollTo('projects')">{{ t.nav.projects }}</a></li>
      <li><a href="#contact" @click="scrollTo('contact')">{{ t.nav.contact }}</a></li>
    </ul>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { useDarkMode } from '../composables/useDarkMode'

const { language, t, toggleLanguage } = useLanguage()
const { isDarkMode, toggleDarkMode } = useDarkMode()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const scrollTo = (section) => {
  mobileMenuOpen.value = false
  const element = document.getElementById(section)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--overlay-light);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px var(--shadow-color);
  z-index: 1000;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.nav {
  max-width: $breakpoint-xl;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dark-mode-toggle {
  width: 40px;
  height: 40px;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid var(--text-primary);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  .icon {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  &:hover {
    background: var(--bg-tertiary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }
}

.language-toggle {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px $shadow-color-button;
  }
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;

  a {
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 500;
    transition: color 0.3s;
    position: relative;

    &:hover {
      color: $primary-blue;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
      transition: width 0.3s;
    }

    &:hover::after {
      width: 100%;
    }
  }
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;

  span {
    width: 25px;
    height: 3px;
    background: $text-dark;
    transition: all 0.3s;
  }
}

// Hide mobile menu on desktop
.nav-links.mobile {
  display: none;
}

@include mobile {
  .nav-links:not(.mobile) {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .dark-mode-toggle {
    width: 36px;
    height: 36px;
    padding: 0.4rem;

    .icon {
      width: 18px;
      height: 18px;
    }
  }

  .language-toggle {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .nav-links.mobile {
    display: flex;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--overlay-medium);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 2rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s;
    box-shadow: 0 4px 20px var(--shadow-color);
    pointer-events: none;

    &.active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    li {
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>

