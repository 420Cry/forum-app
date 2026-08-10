<script setup lang="ts">
import type { NuxtError } from '#app'
import NotFoundView from '~/components/shared/NotFoundView.vue'

const props = defineProps<{ error: NuxtError }>()

const localePath = useLocalePath()
const statusCode = computed(() => props.error?.statusCode ?? 500)

function goHome() {
  clearError({ redirect: localePath('/social') })
}
</script>

<template>
  <NotFoundView
    v-if="statusCode === 404"
    :status-code="404"
  />
  <div
    v-else
    class="min-h-screen flex flex-col items-center justify-center bg-surface px-6 text-center"
  >
    <p class="text-sm font-semibold text-ink-3">
      {{ statusCode }}
    </p>
    <h1 class="mt-2 text-2xl font-bold text-ink">
      {{ $t('common.error.generic_title') }}
    </h1>
    <p class="mt-3 text-sm text-ink-3">
      {{ error?.statusMessage || $t('common.error.try_again') }}
    </p>
    <button
      type="button"
      class="mt-8 text-sm font-semibold text-brand hover:text-brand-hover"
      @click="goHome"
    >
      {{ $t('common.action.go_home') }}
    </button>
  </div>
</template>
