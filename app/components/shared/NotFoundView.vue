<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'

withDefaults(
  defineProps<{
    statusCode?: number
  }>(),
  { statusCode: 404 },
)

const { t } = useI18n()
const localePath = useLocalePath()

function goHome() {
  void navigateTo(localePath('/social'))
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <div
      class="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <p class="text-sm font-semibold tracking-wide text-ink-3">
        {{ statusCode }}
      </p>
      <h1 class="mt-2 text-2xl font-bold text-ink sm:text-3xl">
        {{
          statusCode === 404
            ? t('common.error.page_not_found_title')
            : t('common.error.generic_title')
        }}
      </h1>
      <p class="mt-3 text-sm text-ink-3">
        {{
          statusCode === 404
            ? t('common.error.page_not_found_body')
            : t('common.error.try_again')
        }}
      </p>
      <BaseButton
        class="mt-8"
        intent="primary"
        size="md"
        @click="goHome"
      >
        {{ t('common.action.go_home') }}
      </BaseButton>
    </div>
  </div>
</template>
