<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ currentYear }} Portfolio. {{ t.footer.rights }}</p>
      <div class="footer-links">
        <a href="https://github.com" target="_blank" class="footer-link">GitHub</a>
        <a href="https://linkedin.com" target="_blank" class="footer-link">LinkedIn</a>
        <a href="mailto:your.email@example.com" class="footer-link">{{ t.contact.email }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const currentYear = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.footer {
  background: var(--bg-inverse);
  color: var(--text-inverse);
  padding: 2rem;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
}

.container {
  max-width: $breakpoint-xl;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: var(--text-inverse);
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: $primary-blue;
  }
}

@include mobile {
  .container {
    flex-direction: column;
  }
}
</style>
