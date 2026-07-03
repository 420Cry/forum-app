<script setup lang="ts">
const props = defineProps<{
  step: number;
  totalSteps: number;
  label: string;
}>();

const fillPercent = computed(() => (props.step / props.totalSteps) * 100);
</script>

<template>
  <div class="bg-card border-b border-line px-8 pt-5 pb-[22px]">
    <div class="mx-auto max-w-[720px]">
      <div
        class="mb-2.5 flex items-center justify-between text-[13px] font-medium text-ink-3"
      >
        <span>
          <b class="font-semibold text-ink">Step {{ step }} of {{ totalSteps }}</b>
          &nbsp;·&nbsp;{{ label }}
        </span>
        <span>~ 2 min total</span>
      </div>
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          class="h-full rounded-full bg-brand transition-all duration-300"
          :style="{ width: fillPercent + '%' }"
        />
      </div>
    </div>
  </div>
</template>
