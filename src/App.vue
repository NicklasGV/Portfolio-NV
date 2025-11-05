<template>
  <RouterView />
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import profileImageUrl from '@/assets/images/profile.png?url'

const route = useRoute()

const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

const toAbsolute = (path) => {
  if (!path) {
    return undefined
  }

  if (path.startsWith('http')) {
    return path
  }

  if (!siteUrl && typeof window === 'undefined') {
    return path
  }

  const base = siteUrl || window.location.origin
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

const structuredData = computed(() => {
  const canonical = (() => {
    if (siteUrl) {
      return `${siteUrl}${route?.fullPath || ''}`
    }

    if (typeof window !== 'undefined') {
      return window.location.href
    }

    return undefined
  })()

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Nicklas Vedeby',
      jobTitle: 'Data Technician & Web Developer',
      url: canonical,
      image: toAbsolute(profileImageUrl),
      email: 'mailto:nvedeby@gmail.com',
      telephone: '+4560524646',
      worksFor: {
        '@type': 'Organization',
        name: 'Samlino.dk',
        url: 'https://www.samlino.dk/',
      },
      sameAs: [
        'https://www.linkedin.com/in/nicklas-vedeby-3155351b7/',
        'https://github.com/NicklasGV',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'DK',
      },
    },
    null,
    2,
  )
})

if (typeof window !== 'undefined') {
  const scriptId = 'ld-json-person'
  const selector = `script[data-ld-json="${scriptId}"]`

  const upsertScript = (json) => {
    const head = document.head || document.getElementsByTagName('head')[0]
    if (!head) {
      return
    }

    let script = head.querySelector(selector)
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.ldJson = scriptId
      head.appendChild(script)
    }

    script.textContent = json
  }

  const stop = watch(
    structuredData,
    (json) => {
      if (json) {
        upsertScript(json)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    stop()
    const existing = document.head.querySelector(selector)
    existing?.remove()
  })
}
</script>

