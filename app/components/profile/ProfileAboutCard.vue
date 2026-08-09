<script setup lang="ts">
defineProps<{
  about?: string | null
  facts: { key: string, value: string, chips?: string[] }[]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="bg-card border border-line rounded-md shadow-1">
    <div class="p-6 sm:px-7 sm:py-6">
      <h2 class="text-lg font-bold text-ink tracking-[-0.012em] mb-3.5">
        {{ t('profiles.heading.about') }}
      </h2>
      <p
        v-if="about"
        class="text-[14.5px]/relaxed text-ink-2 max-w-[64ch] text-pretty"
      >
        {{ about }}
      </p>
      <p
        v-else
        class="text-[14.5px] text-ink-4"
      >
        {{ t('profiles.info.no_about') }}
      </p>
      <div
        v-if="facts.length"
        class="mt-4.5 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="fact in facts"
          :key="fact.key"
          :class="{ 'sm:col-span-2 lg:col-span-3': fact.chips?.length }"
        >
          <div
            class="text-[11.5px] font-semibold text-ink-4 uppercase tracking-wider"
          >
            {{ fact.key }}
          </div>
          <div
            v-if="fact.chips?.length"
            class="mt-1.5 flex flex-wrap gap-1.5"
          >
            <span
              v-for="chip in fact.chips"
              :key="chip"
              class="inline-flex items-center rounded-pill border border-line bg-surface-hover px-2.5 py-1 text-[12.5px] font-semibold text-ink-2"
            >
              {{ chip }}
            </span>
          </div>
          <div
            v-else
            class="text-[14.5px] text-ink mt-1 font-medium wrap-break-word"
          >
            {{ fact.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
