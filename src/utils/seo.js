import socialImageUrl from '@/assets/images/profile.png?url'

const DEFAULT_TITLE = "Nicklas Vedeby — Portfolio"
const DEFAULT_DESCRIPTION = "Nicklas Vedeby's portfolio showcasing his journey as a Data Technician and Web Developer, built with Vue.js 3 and Vite."
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
  upsertMetaTag({ property: 'og:url', content: canonicalUrl })
  upsertMetaTag({ property: 'og:locale', content: locale })
  upsertMetaTag({ property: 'og:site_name', content: 'Nicklas Vedeby Portfolio' })

  upsertLinkTag('canonical', canonicalUrl)
}

export const getDefaultSEO = () => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  type: DEFAULT_TYPE,
  image: socialImageUrl,
})

