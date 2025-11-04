<template>
  <section id="contact" class="section contact">
    <div class="container">
      <h2 class="section-title">{{ t.contact.title }}</h2>
      <div class="contact-content">
        <div class="contact-info">
          <p class="contact-intro">
            {{ t.contact.intro }}
          </p>
          <div class="contact-methods">
            <div class="contact-method">
              <div class="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <h4>{{ t.contact.email }}</h4>
                <a href="mailto:nvedeby@gmail.com">nvedeby@gmail.com</a>
              </div>
            </div>
            <div class="contact-method">
              <div class="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <h4>{{ t.contact.phone }}</h4>
                <a href="tel:+4560524646">+45 60 52 46 46</a>
              </div>
            </div>
            <div class="contact-method">
              <div class="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <div>
                <h4>{{ t.contact.linkedin }}</h4>
                <a href="https://www.linkedin.com/in/nicklas-vedeby-3155351b7/" target="_blank">linkedin.com/in/nicklas-vedeby</a>
              </div>
            </div>
          </div>
          <p class="contact-download">
            <span>{{ t.contact.downloadLabel }}</span>
            <a
              :href="cvUrl"
              download
              target="_blank"
              rel="noopener"
            >
              {{ t.contact.downloadLink }}
            </a>
          </p>
        </div>
        <!-- <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">{{ t.contact.form.name }}</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              required 
              :placeholder="t.contact.form.namePlaceholder"
            />
          </div>
          <div class="form-group">
            <label for="email">{{ t.contact.form.email }}</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required 
              :placeholder="t.contact.form.emailPlaceholder"
            />
          </div>
          <div class="form-group">
            <label for="message">{{ t.contact.form.message }}</label>
            <textarea 
              id="message" 
              v-model="form.message" 
              required 
              rows="6"
              :placeholder="t.contact.form.messagePlaceholder"
            ></textarea>
          </div>
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? t.contact.form.sending : t.contact.form.submit }}
          </button>
          <p
            v-if="status"
            class="form-status"
            :class="`form-status--${status.type}`"
            role="status"
            aria-live="polite"
          >
            {{ status.message }}
          </p>
        </form> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const cvUrl = new URL('../assets/pdfs/cv-nicklas-vedeby.pdf', import.meta.url)
const formCopy = computed(() => t.value.contact.form)
const form = ref({
  name: '',
  email: '',
  message: ''
})

const status = ref(null)
const isSubmitting = ref(false)
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  status.value = {
    type: 'info',
    message: formCopy.value.sending,
  }

  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok || !result?.success) {
      throw new Error(result?.message || formCopy.value.error)
    }

    status.value = {
      type: 'success',
      message: formCopy.value.success,
    }
    form.value = { name: '', email: '', message: '' }
  } catch (error) {
    status.value = {
      type: 'error',
      message: error?.message || formCopy.value.error,
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact {
  padding: 80px 2rem;
  background: var(--bg-primary);
  transition: background-color 0.3s;
}

.contact-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4rem;
  max-width: $breakpoint-xl;
  margin: 0 auto;
}

.contact-intro {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
}

.contact-method {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: $text-white;

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }
}

.contact-method h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.contact-method a {
  color: $primary-blue;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: $secondary-blue;
  }
}

.contact-download {
  margin-top: 2rem;
  font-size: 1rem;
  color: var(--text-secondary);

  a {
    margin-left: 0.35rem;
    color: $primary-blue;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: $secondary-blue;
    }
  }
}

.contact-form {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  transition: background-color 0.3s;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--bg-tertiary);
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: border-color 0.3s, background-color 0.3s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: $primary-blue;
    }
  }
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
  color: $text-white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px $shadow-color-button;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
}

.form-status {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  background: var(--bg-tertiary);
  border: 1px solid transparent;

  &--info {
    border-color: rgba($primary-blue, 0.4);
    color: $primary-blue;
  }

  &--success {
    border-color: rgba(60, 204, 137, 0.4);
    color: #2c9464;
  }

  &--error {
    border-color: rgba(220, 53, 69, 0.4);
    color: #c12b39;
  }
}

@include tablet-down {
  .contact {
    padding: 70px 1.5rem;
  }

  .contact-content {
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }

  .contact-info {
    width: 100%;
    max-width: 520px;
    text-align: center;
  }

  .contact-method {
    width: 100%;
  }

  .contact-method h4,
  .contact-method a {
    text-align: left;
  }

  .contact-download {
    text-align: center;

    a {
      display: inline-block;
      margin: 0.5rem 0 0;
    }
  }
}

@include mobile {
  .contact-content {
    gap: 2rem;
  }

  .contact-method {
    gap: 0.75rem;
  }

  .contact-icon {
    width: 44px;
    height: 44px;

    svg {
      width: 22px;
      height: 22px;
    }
  }
}
</style>
