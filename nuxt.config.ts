// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Report-friendly baseline CSP. Tighten further once Google Fonts are self-hosted.
  'Content-Security-Policy': [
    'default-src \'self\'',
    'base-uri \'self\'',
    'form-action \'self\'',
    'frame-ancestors \'none\'',
    'object-src \'none\'',
    'img-src \'self\' data: blob: https:',
    'media-src \'self\' blob: https:',
    'font-src \'self\' data: https://fonts.gstatic.com',
    'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
    'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
    'connect-src \'self\' https: wss: http://api.forum.test http://127.0.0.1:* http://localhost:*',
    'worker-src \'self\' blob:',
  ].join('; '),
}

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/supabase', '@nuxtjs/i18n'],
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
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
    '/en/auth/confirm': { ssr: false },
    '/vn/auth/confirm': { ssr: false },
    '/en/auth/reset-password': { ssr: false },
    '/vn/auth/reset-password': { ssr: false },
    '/en/messages': { ssr: false },
    '/vn/messages': { ssr: false },
    '/**': {
      headers: securityHeaders,
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    },
  },
})
