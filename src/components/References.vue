<template>
  <section id="references" class="section references">
    <div class="container">
      <h2 class="section-title">{{ referencesSection.title }}</h2>
      <p v-if="referencesSection.subtitle" class="section-subtitle">
        {{ referencesSection.subtitle }}
      </p>

      <div class="references-grid">
        <article
          v-for="(reference, index) in referencesSection.items"
          :key="index"
          class="reference-card"
        >
          <blockquote class="reference-quote">
            {{ reference.quote }}
          </blockquote>
          <div class="reference-meta">
            <p class="reference-name">{{ reference.name }}</p>
            <p v-if="reference.role" class="reference-role">{{ reference.role }}</p>
          </div>
          <div class="reference-actions">
            <div v-if="reference.contact" class="reference-contact">
              <a
                v-if="reference.contact.email"
                :href="`mailto:${reference.contact.email}`"
                class="contact-link"
              >
                {{ referencesSection.contactLabels?.email || 'Email' }}
              </a>
              <a
                v-if="reference.contact.phone"
                :href="`tel:${reference.contact.phone}`"
                class="contact-link"
              >
                {{ referencesSection.contactLabels?.phone || 'Phone' }}
              </a>
              <a
                v-if="reference.contact.linkedin"
                :href="reference.contact.linkedin"
                target="_blank"
                rel="noopener"
                class="contact-link"
              >
                {{ referencesSection.contactLabels?.linkedin || 'LinkedIn' }}
              </a>
            </div>
            <a
              v-if="reference.document?.href"
              :href="reference.document.href"
              target="_blank"
              rel="noopener"
              class="document-link"
            >
              {{ reference.document.label }}
            </a>
          </div>
          <p v-if="reference.date" class="reference-date">
            {{ reference.date }}
          </p>
        </article>
      </div>

      <div
        v-if="referencesSection.others.length"
        class="references-more"
      >
        <h3 class="more-title">{{ referencesSection.otherTitle }}</h3>
        <div class="more-grid">
          <div
            v-for="(other, index) in referencesSection.others"
            :key="index"
            class="more-card"
          >
            <p class="more-name">{{ other.name }}</p>
            <p v-if="other.role" class="more-role">{{ other.role }}</p>
            <span v-if="other.email">
                Work {{ t.contact.email }}:
                <a
                  v-if="other.email"
                  :href="`mailto:${other.email}`"
                  class="more-contact"
                >
                {{ other.email }}
                </a>
            </span>
            <span v-if="other.personalEmail">
                {{ t.contact.email }}:
                <a
                  v-if="other.personalEmail"
                  :href="`mailto:${other.personalEmail}`"
                  class="more-contact"
                >
                {{ other.personalEmail }}
                </a>
            </span>
            <span v-if="other.phone">
                {{ t.contact.phone }}:
                <a
                  v-if="other.phone"
                  :href="`tel:${other.phone}`"
                  class="more-contact"
                >
                {{ other.phone }}
                </a>
            </span>
            <span v-if="other.linkedin">
                {{ t.contact.linkedin }}:
                <a
                  v-if="other.linkedin"
                  :href="other.linkedin"
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  class="more-contact"
                >
                {{ other.name }}
                </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

const referencesSection = computed(() => {
  const section = t.value.references || {}

  return {
    title: section.title || '',
    subtitle: section.subtitle || '',
    contactLabels: section.contactLabels || {},
    items: (section.items || []).map((item) => ({
      ...item,
      contact: item.contact || null,
      document: item.document || null,
    })),
    otherTitle: section.otherTitle || '',
    others: (section.others || []).map((other) => ({
      name: other.name || '',
      role: other.role || '',
      email: other.email || '',
      personalEmail: other.personalEmail || '',
      phone: other.phone || '',
      linkedin: other.linkedin || '',
    })),
  }
})
</script>

<style lang="scss" scoped>
.references {
  padding: 80px 2rem;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.container {
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.section-subtitle {
  max-width: 680px;
  margin: 0 auto 3rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.7;
}

.references-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.reference-card {
  background: var(--bg-secondary);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, rgba(44, 96, 255, 0.15), transparent 55%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 30px var(--shadow-color-hover);
  }
}

.reference-quote {
  margin: 0 0 2rem;
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.8;
  position: relative;
  padding: 1.5rem 2rem 1.5rem 3.1rem;
  border: 1px solid rgba(44, 96, 255, 0.2);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(44, 96, 255, 0.12) 0%, rgba(44, 96, 255, 0.05) 100%);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);

  &::before {
    content: '\201C';
    position: absolute;
    top: 0.55rem;
    left: 1rem;
    font-size: 3rem;
    color: rgba(44, 96, 255, 0.25);
    line-height: 1;
  }

  &::after {
    content: '\201D';
    position: absolute;
    bottom: 0.5rem;
    right: 1.1rem;
    font-size: 3rem;
    color: rgba(44, 96, 255, 0.18);
    line-height: 1;
  }
}

.reference-meta {
  margin-bottom: 1.5rem;

  p {
    margin: 0;
  }
}

.reference-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.reference-role,
.reference-relationship {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.reference-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reference-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  color: $text-white;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px $shadow-color-button;
  }
}

.document-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  color: $primary-blue;
  border: 2px solid $primary-blue;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s, color 0.3s;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
    color: $text-white;
    box-shadow: 0 6px 18px $shadow-color-button;
  }
}

.reference-date {
  margin-top: 1.25rem;
  color: var(--text-tertiary, var(--text-secondary));
  font-size: 0.85rem;
}

.references-more {
  margin-top: 4rem;
}

.more-title {
  text-align: center;
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 1.75rem;
}

.more-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.more-card {
  background: var(--bg-secondary);
  border: 1px solid rgba(44, 96, 255, 0.18);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  }
}

.more-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0;
}

.more-role {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.more-contact {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: $primary-blue;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

@include mobile {
  .references {
    padding: 60px 1.5rem;
  }

  .reference-card {
    padding: 2rem 1.5rem;
  }

  .reference-quote {
    font-size: 1rem;
    padding: 1.25rem 1.5rem 1.25rem 2.6rem;
  }

  .more-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}
</style>

