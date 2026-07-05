// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/supabase'],
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      forumApiUrl:
        process.env.NUXT_PUBLIC_FORUM_API_URL || 'http://api.forum.test',
    },
  },
  alias: {
    '@composables': resolve(currentDir, 'app/composables'),
    '@components': resolve(currentDir, 'app/components'),
    '@pages': resolve(currentDir, 'app/pages'),
    '@layouts': resolve(currentDir, 'app/layouts'),
    '@assets': resolve(currentDir, 'app/assets'),
    '@plugins': resolve(currentDir, 'app/plugins'),
    '@types': resolve(currentDir, 'app/types'),
    '@constants': resolve(currentDir, 'app/constants'),
  },
  routeRules: {
    '/auth/confirm': { ssr: false },
    '/auth/reset-password': { ssr: false },
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      stylistic: {
        semi: false,
      },
    },
  },
  icon: {
    mode: 'svg',
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      callback: '/auth/confirm',
      exclude: ['/auth/confirm'],
    },
  },
})
