<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; {{ currentYear }} Portfolio. {{ t.footer.rights }}</p>
      <div class="footer-links">
        <a :href="cvUrl" download target="_blank" rel="noopener" class="footer-link">{{ t.footer.downloadCv }}</a>
        <a href="https://github.com/NicklasGV" target="_blank" class="footer-link">GitHub</a>
        <a href="https://www.linkedin.com/in/nicklas-vedeby-3155351b7/" target="_blank" class="footer-link">LinkedIn</a>
        <a href="mailto:nvedeby@gmail.com" class="footer-link">{{ t.contact.email }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const currentYear = new Date().getFullYear()
const cvUrl = new URL('../assets/pdfs/cv-nicklas-vedeby.pdf', import.meta.url)
</script>

<style lang="scss" scoped>
.footer {
  background: $bg-dark;
  color: $bg-light;
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
  color: $bg-light;
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
