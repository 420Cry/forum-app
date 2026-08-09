<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="bg-card border border-line rounded-lg shadow-1 overflow-hidden">
      <div class="px-4 pt-4 pb-2">
        <p class="text-[15px] font-semibold text-ink">
          {{ t('social.heading.suggested_follow') }}
        </p>
      </div>
      <div class="px-4 pb-4">
        <p class="text-[13px] font-semibold text-ink">
          {{ t('social.empty.suggested_title') }}
        </p>
        <p class="text-[12.5px]/relaxed text-ink-3 mt-1">
          {{ t('social.empty.suggested_body') }}
        </p>
        <NuxtLink
          :to="localePath('/find')"
          class="inline-block mt-2 text-[12.5px] font-semibold text-brand no-underline"
        >
          {{ t('find.action.see_more') }} →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
