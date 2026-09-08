import { createRouter, createWebHistory } from 'vue-router'
import { applyRouteSEO } from '@/composables/useLanguage'

const SITE_URL = import.meta.env.VITE_SITE_URL || ''

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home.vue'),
      // seoKey selects the translated title and description, so the tags
      // follow the language toggle instead of being pinned to English.
      meta: {
        seoKey: 'home',
        type: 'website',
      },
    },
    {
      path: '/arcade',
      name: 'arcade',
      component: () => import('../pages/Arcade.vue'),
      meta: {
        seoKey: 'arcade',
        type: 'website',
      },
    },
    {
      path: '/arcade/:slug',
      name: 'arcade-game',
      component: () => import('../pages/Arcade.vue'),
      meta: {
        seoKey: 'arcade',
        type: 'website',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
      meta: {
        seoKey: 'notFound',
        robots: 'noindex, follow',
        type: 'website',
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const url = base ? `${base}${to.fullPath}` : undefined

  applyRouteSEO(to.meta, url)
})

export default router
