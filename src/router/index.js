import { createRouter, createWebHistory } from 'vue-router'
import { updateSEO } from '@/utils/seo'

const SITE_URL = import.meta.env.VITE_SITE_URL || ''

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home.vue'),
      meta: {
        title: 'Nicklas Vedeby — Portfolio',
        description: "Nicklas Vedeby's portfolio showcasing his journey as a Data Technician and Web Developer, featuring case studies, experience, and contact details.",
        type: 'website',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
      meta: {
        title: 'Page Not Found — Nicklas Vedeby',
        description: 'The page you were looking for could not be found on Nicklas Vedeby\'s portfolio website.',
        robots: 'noindex, nofollow',
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

  updateSEO({ ...to.meta, url })
})

export default router

