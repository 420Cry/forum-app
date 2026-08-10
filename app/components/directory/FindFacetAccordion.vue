<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'

const model = defineModel<string[]>({ required: true })

const props = withDefaults(
  defineProps<{
    title: string
    options: { value: string, label: string }[]
    anyLabel: string
    defaultOpen?: boolean
  }>(),
  {
    defaultOpen: false,
  },
)

const open = ref(props.defaultOpen || model.value.length > 0)

watch(
  () => model.value.length,
  (count) => {
    if (count > 0) open.value = true
  },
)

const selectedSummary = computed(() => {
  if (!model.value.length) return null
  const labels = model.value.map(
    value => props.options.find(o => o.value === value)?.label ?? value,
  )
  if (labels.length <= 2) return labels.join(', ')
  return `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`
})

function clearAll() {
  model.value = []
}

function toggle(value: string) {
  if (model.value.includes(value)) {
    model.value = model.value.filter(v => v !== value)
    return
  }
  model.value = [...model.value, value]
}

function isSelected(value: string) {
  return model.value.includes(value)
}
</script>

<template>
  <section class="border-b border-line last:border-b-0">
    <button
      type="button"
      class="flex w-full items-center gap-2 py-3.5 text-left cursor-pointer"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="min-w-0 flex-1">
        <span class="block text-[14px] font-semibold text-ink">
          {{ title }}
        </span>
        <span
          v-if="selectedSummary"
          class="mt-0.5 block truncate text-[12.5px] text-brand"
        >
          {{ selectedSummary }}
        </span>
      </span>
      <BaseIcon
        name="chevron"
        size="1.35em"
        class="flex-none text-ink-4 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <div
      v-show="open"
      class="pb-3"
    >
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left text-[13.5px] cursor-pointer transition-colors"
        :class="
          model.length === 0
            ? 'bg-brand-tint text-brand font-semibold'
            : 'text-ink-2 hover:bg-surface-hover'
        "
        @click="clearAll"
      >
        <span class="min-w-0 flex-1">{{ anyLabel }}</span>
        <span
          class="flex size-4.5 flex-none items-center justify-center rounded-[4px] border-[1.5px]"
          :class="model.length === 0 ? 'border-brand bg-brand' : 'border-line-2'"
          aria-hidden="true"
        >
          <BaseIcon
            v-if="model.length === 0"
            name="check"
            size="0.85em"
            class="text-white"
          />
        </span>
      </button>

      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left text-[13.5px] cursor-pointer transition-colors"
        :class="
          isSelected(opt.value)
            ? 'bg-brand-tint text-brand font-semibold'
            : 'text-ink-2 hover:bg-surface-hover'
        "
        @click="toggle(opt.value)"
      >
        <span class="min-w-0 flex-1">{{ opt.label }}</span>
        <span
          class="flex size-4.5 flex-none items-center justify-center rounded-[4px] border-[1.5px]"
          :class="
            isSelected(opt.value)
              ? 'border-brand bg-brand'
              : 'border-line-2'
          "
          aria-hidden="true"
        >
          <BaseIcon
            v-if="isSelected(opt.value)"
            name="check"
            size="0.85em"
            class="text-white"
          />
        </span>
      </button>
    </div>
  </section>
</template>
