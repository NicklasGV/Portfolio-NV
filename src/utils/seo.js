// Served from /public so it keeps a stable URL. Vite fingerprints anything
// imported from src, which a crawler cannot resolve from the static HTML.
const socialImageUrl = '/og-image.jpg'

// Kept in step with the static tags in index.html, so the page never flashes a
// different title before the router applies the translated one.
const DEFAULT_TITLE = 'Nicklas Vedeby | Fullstack Udvikler'
const DEFAULT_DESCRIPTION = 'Fullstack udvikler i Storkøbenhavn. Erfaring med Vue, Nuxt, TypeScript, Python og SQL. Se mine projekter og referencer, og skriv hvis du søger en udvikler.'
const DEFAULT_TYPE = 'website'
const SITE_URL = import.meta.env.VITE_SITE_URL || ''

const getOgLocale = () => {
  const lang = document?.documentElement?.lang || 'da'

  switch (lang) {
    case 'en':
    case 'en-US':
    case 'en_GB':
      return 'en_US'
    case 'da':
    case 'da-dk':
    case 'da-DK':
    default:
      return 'da_DK'
  }
}

const upsertMetaTag = ({ name, property, content }) => {
  if (!name && !property) {
    return
  }

  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  let tag = document.head.querySelector(selector)

  if (!content) {
    if (tag) {
      tag.remove()
    }
    return
  }

  if (!tag) {
    tag = document.createElement('meta')

    if (name) {
      tag.setAttribute('name', name)
    }

    if (property) {
      tag.setAttribute('property', property)
    }

    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

const upsertLinkTag = (rel, href) => {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)

  if (!href) {
    if (tag) {
      tag.remove()
    }
    return
  }

  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }

  tag.setAttribute('href', href)
}

// Rebuilt wholesale on every navigation. Editing in place would risk leaving
// an alternate behind that points at the previous page.
const upsertAlternates = (alternates = []) => {
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((tag) => tag.remove())

  alternates.forEach(({ hreflang, href }) => {
    if (!hreflang || !href) {
      return
    }

    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', hreflang)
    link.setAttribute('href', href)
    document.head.appendChild(link)
  })
}

const buildAbsoluteUrl = (path = '') => {
  if (!path) {
    return undefined
  }

  if (path.startsWith('http')) {
    return path
  }

  const base = SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

  if (!base) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${base}${normalizedPath}`
}

export const updateSEO = (meta = {}) => {
  if (typeof window === 'undefined') {
    return
  }

  const {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    type = DEFAULT_TYPE,
    robots = 'index, follow',
    image = socialImageUrl,
    url,
  } = meta

  const canonicalUrl = url
    || (SITE_URL
      ? `${SITE_URL}${window.location.pathname}${window.location.search}`
      : window.location.href)
  const locale = meta.locale || getOgLocale()

  document.title = title

  upsertMetaTag({ name: 'description', content: description })
  upsertMetaTag({ name: 'robots', content: robots })
  upsertMetaTag({ name: 'twitter:card', content: 'summary_large_image' })
  upsertMetaTag({ name: 'twitter:title', content: title })
  upsertMetaTag({ name: 'twitter:description', content: description })
  upsertMetaTag({ name: 'twitter:image', content: buildAbsoluteUrl(image) })
  upsertMetaTag({ name: 'twitter:url', content: canonicalUrl })

  upsertMetaTag({ property: 'og:title', content: title })
  upsertMetaTag({ property: 'og:description', content: description })
  upsertMetaTag({ property: 'og:type', content: type })
  upsertMetaTag({ property: 'og:image', content: buildAbsoluteUrl(image) })
  upsertMetaTag({ property: 'og:image:width', content: '1200' })
  upsertMetaTag({ property: 'og:image:height', content: '630' })
  upsertMetaTag({ property: 'og:image:alt', content: 'Nicklas Vedeby, Fullstack Developer' })
  upsertMetaTag({ property: 'og:url', content: canonicalUrl })
  upsertMetaTag({ property: 'og:locale', content: locale })
  upsertMetaTag({ property: 'og:site_name', content: 'Nicklas Vedeby' })

  upsertLinkTag('canonical', canonicalUrl)
  upsertAlternates(meta.alternates)
}

export const getDefaultSEO = () => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  type: DEFAULT_TYPE,
  image: socialImageUrl,
})

