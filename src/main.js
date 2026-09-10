import { createApp } from 'vue'
import './styles/main.scss'
import App from './App.vue'
import router from './router'
import { updateSEO } from '@/utils/seo'

// Favicons are declared statically in index.html and served from /public.
// They used to be injected here, which meant Google's favicon crawler never
// saw them, because it does not execute JavaScript.
updateSEO()

const app = createApp(App)

app.use(router)

app.mount('#app')
