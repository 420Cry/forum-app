import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const appDir = fileURLToPath(new URL('./app', import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['app/**/*.{ts,vue}'],
    },
  },
  resolve: {
    alias: {
      '~': appDir,
    },
  },
})
