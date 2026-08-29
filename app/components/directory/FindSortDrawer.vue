<script setup lang="ts">
import BaseDrawer from '~/components/shared/BaseDrawer.vue'
import type { FindSort } from '~/types/find'

const open = defineModel<boolean>('open', { default: false })
const sort = defineModel<FindSort>({ required: true })

const emit = defineEmits<{
  select: [value: FindSort]
}>()

const { t } = useI18n()

const options: { value: FindSort, labelKey: string }[] = [
  { value: 'newest', labelKey: 'find.sort.newest' },
  { value: 'name', labelKey: 'find.sort.name' },
]

function select(value: FindSort) {
  sort.value = value
  emit('select', value)
  open.value = false
}
</script>

<template>
  <BaseDrawer
    v-model:open="open"
    :title="t('find.action.sort')"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="flex w-full items-center gap-3 border-b border-line px-1 py-3.5 text-left cursor-pointer transition-colors last:border-b-0 hover:bg-surface-hover"
      @click="select(opt.value)"
    >
      <span
        class="min-w-0 flex-1 text-[14px]"
        :class="sort === opt.value ? 'font-semibold text-ink' : 'text-ink-2'"
      >
        {{ t(opt.labelKey) }}
      </span>
      <span
        class="flex size-5 flex-none items-center justify-center rounded-full border-[1.5px]"
        :class="sort === opt.value ? 'border-brand bg-brand' : 'border-line-2'"
        aria-hidden="true"
      >
        <span
          v-if="sort === opt.value"
          class="size-2 rounded-full bg-white"
        />
      </span>
    </button>
  </BaseDrawer>
</template>
