<template>
  <footer class="footer">
    <div class="container">
      <img
        src="../assets/images/logo-lockup.jpg"
        alt="Nicklas Vedeby — Fullstack Developer"
        class="footer-logo"
        width="280"
        height="222"
        loading="lazy"
        decoding="async"
      />

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Nicklas Vedeby. {{ t.footer.rights }}</p>
        <div class="footer-links">
          <a :href="cvUrl" download target="_blank" rel="noopener" class="footer-link">{{ t.footer.downloadCv }}</a>
          <a href="https://github.com/NicklasGV" target="_blank" class="footer-link">GitHub</a>
          <a href="https://www.linkedin.com/in/nicklas-vedeby-3155351b7/" target="_blank" class="footer-link">LinkedIn</a>
          <a href="mailto:nvedeby@gmail.com" class="footer-link">{{ t.contact.email }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const currentYear = new Date().getFullYear()
const cvUrl = new URL('../assets/pdfs/CV_nicklas_vedeby.pdf', import.meta.url)
</script>

<style lang="scss" scoped>
.footer {
  // Pure black, so the lockup's own background disappears into the footer
  // rather than sitting on it as a visible tile.
  background: #000;
  color: $bg-light;
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.container {
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.footer-logo {
  display: block;
  width: 280px;
  height: auto;
  margin: 0 auto 2.5rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  p {
    margin: 0;
  }
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: $bg-light;
  text-decoration: none;
  transition: color 0.3s;

  // $primary-blue is too dark to read against pure black.
  &:hover {
    color: $accent-blue;
  }
}

@include mobile {
  .footer {
    padding: 2.5rem 1.25rem 1.75rem;
  }

  .footer-logo {
    width: 210px;
    margin-bottom: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1.25rem;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
  }
}
</style>
