// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { securityHeaders } from './config/securityHeaders'

const currentDir = fileURLToPath(new URL('.', import.meta.url))
const forumApiUrl
  = process.env.NUXT_PUBLIC_FORUM_API_URL || 'http://api.forum.test'
const supabaseUrl
  = process.env.NUXT_PUBLIC_SUPABASE_URL || 'http://supabase.forum.test'
// Opt in to dev relaxations explicitly — an unset NODE_ENV stays hardened.
const isDev = process.env.NODE_ENV === 'development'

const headers = securityHeaders({
  apiOrigins: [forumApiUrl, supabaseUrl],
  dev: isDev,
})

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/supabase', '@nuxtjs/i18n'],
  devtools: { enabled: isDev },
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      forumApiUrl,
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
    '/en/auth/confirm': { ssr: false },
    '/vn/auth/confirm': { ssr: false },
    '/en/auth/reset-password': { ssr: false },
    '/vn/auth/reset-password': { ssr: false },
    '/en/messages': { ssr: false },
    '/vn/messages': { ssr: false },
    '/**': {
      headers,
    },
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Proxy dev traffic arrives with Host: app.forum.test (Vite 6+ blocks unknown hosts).
      allowedHosts: ['app.forum.test', 'localhost', '127.0.0.1'],
    },
  },
  eslint: {
    config: {
      stylistic: {
        semi: false,
      },
    },
  },
  i18n: {
    restructureDir: '.',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en/forum-common.json' },
      { code: 'vn', name: 'Tiếng Việt', file: 'vn/forum-common.json' },
    ],
    langDir: 'locales',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'forum_locale',
      fallbackLocale: 'en',
      redirectOn: 'root',
    },
  },
  icon: {
    mode: 'svg',
  },
  supabase: {
    redirect: false,
    clientOptions: {
      auth: {
        // Email links use token_hash (verifyOtp). Same-browser OAuth uses PKCE.
        // Implicit hash bearer tokens are not accepted by the app callback.
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    },
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/auth/confirm'],
    },
    cookieOptions: {
      // Secure everywhere except the plain-http local dev stack.
      // Do not set httpOnly: the SPA client (PKCE) must persist the session
      // cookie after sign-in. httpOnly:true left e2e login on /auth/login.
      secure: !isDev,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    },
  },
})
