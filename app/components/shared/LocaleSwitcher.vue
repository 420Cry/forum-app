<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="item in locales"
      :key="item.code"
      type="button"
      class="rounded px-2 py-1 text-xs font-semibold uppercase transition-colors"
      :class="
        locale === item.code
          ? 'bg-brand text-white'
          : 'text-ink-3 hover:bg-surface-hover hover:text-ink'
      "
      @click="setLocale(item.code)"
    >
      {{ item.code }}
    </button>
  </div>
</template>
