import { createApp } from 'vue'
import './styles/main.scss'
import App from './App.vue'
import router from './router'
import favicon32Url from './assets/images/favicon-32.png?url'
import favicon48Url from './assets/images/favicon-48.png?url'
import touchIconUrl from './assets/images/favicon-180.png?url'
import { updateSEO } from '@/utils/seo'

const upsertIcon = (rel, href, { type, sizes } = {}) => {
  const selector = sizes ? `link[rel="${rel}"][sizes="${sizes}"]` : `link[rel="${rel}"]`
  const existing = document.querySelector(selector)
  const link = existing ?? document.createElement('link')

  link.rel = rel
  link.href = href
  if (type) {
    link.type = type
  }
  if (sizes) {
    link.sizes = sizes
  }

  if (!existing) {
    document.head.appendChild(link)
  }
}

const ensureFavicon = () => {
  // The tab icon is cropped to the letterforms — the circuit nodes turn to
  // mush below about 64px. The touch icon keeps the full mark.
  upsertIcon('icon', favicon32Url, { type: 'image/png', sizes: '32x32' })
  upsertIcon('icon', favicon48Url, { type: 'image/png', sizes: '48x48' })
  upsertIcon('apple-touch-icon', touchIconUrl)
}

ensureFavicon()
updateSEO()

const app = createApp(App)

app.use(router)

app.mount('#app')

