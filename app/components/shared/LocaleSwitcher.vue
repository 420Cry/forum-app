<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

function switchTo(code: string) {
  const path = switchLocalePath(code)
  if (path) {
    void navigateTo(path)
  }
}
</script>

<template>
  <div
    class="flex items-center gap-1"
    role="group"
    :aria-label="$t('common.header.language')"
  >
    <button
      v-for="item in locales"
      :key="item.code"
      type="button"
      class="rounded px-2.5 py-1 text-xs font-semibold uppercase transition-colors"
      :class="
        locale === item.code
          ? 'bg-brand text-white'
          : 'text-ink-3 hover:bg-surface-hover hover:text-ink'
      "
      :aria-current="locale === item.code ? 'true' : undefined"
      @click="switchTo(item.code)"
    >
      {{ item.code }}
    </button>
  </div>
</template>
