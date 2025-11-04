import { createApp } from 'vue'
import './styles/main.scss'
import App from './App.vue'
import router from './router'
import faviconUrl from './assets/images/nv.ico?url'
import { updateSEO } from '@/utils/seo'

const ensureFavicon = () => {
  const existing = document.querySelector("link[rel~='icon']")
  const link = existing ?? document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/x-icon'
  link.href = faviconUrl

  if (!existing) {
    document.head.appendChild(link)
  }
}

ensureFavicon()
updateSEO()

const app = createApp(App)

app.use(router)

app.mount('#app')

