import { createRouter, createWebHistory } from 'vue-router'
import { applyLanguage, applyRouteSEO, detectLanguage, isSupportedLanguage } from '@/composables/useLanguage'

// Each language is its own URL (/da, /en) so the two versions can be indexed
// and ranked separately instead of sharing one address.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Entry point with no language of its own: pick one and redirect. This is
    // also what hreflang x-default points at.
    {
      path: '/',
      redirect: () => `/${detectLanguage()}`,
    },

    // Anything linked before the language prefix existed still resolves.
    {
      path: '/arcade',
      redirect: () => `/${detectLanguage()}/arcade`,
    },
    {
      path: '/arcade/:slug',
      redirect: (to) => `/${detectLanguage()}/arcade/${to.params.slug}`,
    },

    {
      path: '/:lang(da|en)',
      name: 'home',
      component: () => import('../pages/Home.vue'),
      // seoKey selects the translated title and description.
      meta: {
        seoKey: 'home',
        type: 'website',
      },
    },
    {
      path: '/:lang(da|en)/arcade',
      name: 'arcade',
      component: () => import('../pages/Arcade.vue'),
      meta: {
        seoKey: 'arcade',
        type: 'website',
      },
    },
    {
      path: '/:lang(da|en)/arcade/:slug',
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
  scrollBehavior(to, from, savedPosition) {
    // Switching language stays on the same page, so hold the scroll position
    // rather than throwing the reader back to the top.
    if (to.name === from.name && to.params.lang !== from.params.lang) {
      return false
    }

    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach((to) => {
  if (isSupportedLanguage(to.params.lang)) {
    applyLanguage(to.params.lang)
  }
})

router.afterEach((to) => {
  applyRouteSEO(to)
})

export default router
