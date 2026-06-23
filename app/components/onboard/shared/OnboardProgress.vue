<script setup lang="ts">
const props = defineProps<{
  step: number;
  totalSteps: number;
  label: string;
}>();

const fillPercent = computed(() => (props.step / props.totalSteps) * 100);
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-ink-4">
        <b class="font-semibold text-ink-3">Step {{ step }} of {{ totalSteps }}</b>
        &nbsp;·&nbsp;{{ label }}
      </span>
      <span class="text-xs text-ink-4">~ 2 min total</span>
    </div>
    <div class="w-full h-[3px] bg-line rounded-full overflow-hidden">
      <div
        class="h-full bg-brand rounded-full transition-all duration-300"
        :style="{ width: fillPercent + '%' }"
      />
    </div>
  </div>
</template>
