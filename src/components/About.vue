<template>
  <section id="about" class="section about">
    <div class="container">
      <h2 class="section-title">{{ t.about.title }}</h2>
      <div class="about-content">
        <div class="about-text">
          <p class="lead" v-html="t.about.lead"></p>
          <p>{{ t.about.text1 }}</p>
          <p>{{ t.about.text2 }}</p>
          <div class="about-actions">
            <p class="contact-download">
            <span>{{ t.about.downloadLabel }}</span>
            <a
              :href="cvUrl"
              download
              target="_blank"
              rel="noopener"
            >
              {{ t.about.downloadCta }}
            </a>
          </p>
          </div>
        </div>
        <div class="about-image">
          <img src="../assets/images/profile.png" alt="Profile Picture" width="430" height="400"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const cvUrl = new URL('../assets/pdfs/cv-nicklas-vedeby.pdf', import.meta.url)
</script>

<style lang="scss" scoped>
.about {
  padding: 120px 2rem 80px;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.container {
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);

  p {
    margin-bottom: 1.5rem;
  }
}

.lead {
  font-size: 1.3rem;
  color: var(--text-primary);
  font-weight: 500;
}

.about-actions {
  margin-top: 2rem;
}

.about-download {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 20px $shadow-color-button;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(44, 96, 255, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
}

.about-image {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    max-width: 420px;
    height: auto;
    border-radius: 20px;
    object-fit: cover;
  }
}

.image-placeholder {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  border-radius: 20px;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px $shadow-color-strong;

  svg {
    width: 80%;
    height: 80%;
  }
}

@include tablet-down {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    justify-items: center;
    text-align: center;
  }

  .about-text {
    max-width: 640px;
  }

  .lead {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .about-actions {
    display: flex;
    justify-content: center;
  }
}
</style>
