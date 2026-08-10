<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'
import type { CatalogLocation } from '~/types/catalogLocations'
import { useLocationsApi } from '~/composables/api/useLocationsApi'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })
/** Selected suggestion display text — must not share the `label` prop name. */
const displayName = defineModel<string>('displayName', { default: '' })

const input = cva(
  [
    'bg-card',
    'border',
    'rounded-md',
    'py-2.5',
    'px-3',
    'text-ink',
    'text-sm',
    'w-full',
    'outline-none',
    'transition-colors',
    'placeholder:text-ink-4',
    'disabled:bg-surface-hover',
    'disabled:text-ink-2',
    'disabled:cursor-default',
  ],
  {
    variants: {
      intent: {
        primary: [
          'border-line',
          'focus:border-brand',
          'focus:ring-2',
          'focus:ring-brand/20',
        ],
        error: [
          'border-red-500',
          'focus:border-red-500',
          'focus:ring-2',
          'focus:ring-red-500/20',
        ],
      },
    },
  },
)

type InputProp = VariantProps<typeof input>

const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    placeholder?: string
    intent?: InputProp['intent']
    errorMsg?: string
    disabled?: boolean
    reserveError?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    intent: 'primary',
    errorMsg: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  change: []
  searchError: [message: string]
}>()

const { t } = useI18n()
const { searchLocations } = useLocationsApi()

const query = ref('')
const open = ref(false)
const loading = ref(false)
const suggestions = ref<CatalogLocation[]>([])
const activeIndex = ref(-1)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let requestSeq = 0

const showError = computed(
  () => props.intent === 'error' && !!props.errorMsg,
)
const showErrorSlot = computed(() => {
  if (showError.value) return true
  if (props.reserveError !== undefined) return props.reserveError
  return !!props.label
})

watch(
  () => displayName.value,
  (next) => {
    if (!open.value && next) query.value = next
  },
  { immediate: true },
)

watch(
  () => model.value,
  (key) => {
    if (!key && !open.value) {
      query.value = ''
      displayName.value = ''
    }
  },
)

function clearDebounce() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

async function runSearch(raw: string) {
  const seq = ++requestSeq
  loading.value = true
  try {
    const rows = await searchLocations(raw)
    if (seq !== requestSeq) return
    suggestions.value = rows
    activeIndex.value = rows.length > 0 ? 0 : -1
    open.value = true
  }
  catch (err: unknown) {
    if (seq !== requestSeq) return
    suggestions.value = []
    activeIndex.value = -1
    const statusCode
      = err && typeof err === 'object' && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode)
        : 0
    const msg
      = err && typeof err === 'object' && 'statusMessage' in err
        ? String((err as { statusMessage?: string }).statusMessage)
        : t('onboard.error.location_search_failed')
    emit('searchError', statusCode === 503 ? msg : t('onboard.error.location_search_failed'))
  }
  finally {
    if (seq === requestSeq) loading.value = false
  }
}

function scheduleSearch(raw: string) {
  clearDebounce()
  // Short debounce so 1-letter typeahead feels immediate.
  const delay = raw.trim().length <= 1 ? 80 : 120
  debounceTimer = setTimeout(() => {
    void runSearch(raw)
  }, delay)
}

function onInput(event: Event) {
  const el = event.target as HTMLInputElement
  query.value = el.value
  // Typing invalidates a previous selection until a suggestion is picked again.
  if (model.value) {
    model.value = ''
    displayName.value = ''
    emit('change')
  }
  scheduleSearch(el.value)
}

function selectSuggestion(row: CatalogLocation) {
  model.value = row.key
  displayName.value = row.name
  query.value = row.name
  open.value = false
  suggestions.value = []
  activeIndex.value = -1
  emit('change')
}

function onFocus() {
  if (props.disabled) return
  void runSearch(query.value)
}

function onBlur() {
  // Allow mousedown on options to fire first.
  window.setTimeout(() => {
    open.value = false
    if (model.value && displayName.value) {
      query.value = displayName.value
    }
    else if (!model.value) {
      query.value = ''
    }
  }, 120)
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value || suggestions.value.length === 0) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      void runSearch(query.value)
    }
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value
      = (activeIndex.value - 1 + suggestions.value.length)
        % suggestions.value.length
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    const row = suggestions.value[activeIndex.value]
    if (row) selectSuggestion(row)
  }
  else if (event.key === 'Escape') {
    open.value = false
  }
}

onBeforeUnmount(() => {
  clearDebounce()
})
</script>

<template>
  <div class="min-w-0 flex flex-col">
    <label
      v-if="label"
      class="block text-sm font-semibold text-ink-2 mb-1"
      :for="id"
    >{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        v-bind="$attrs"
        :value="query"
        type="text"
        role="combobox"
        :aria-expanded="open ? 'true' : 'false'"
        aria-autocomplete="list"
        :aria-controls="`${id}-listbox`"
        :aria-activedescendant="
          activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        "
        :placeholder="placeholder"
        :disabled="disabled"
        :class="input({ intent })"
        :aria-invalid="showError ? true : undefined"
        :aria-describedby="showError ? `${id}-error` : undefined"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      >
      <ul
        v-if="open && (suggestions.length > 0 || loading)"
        :id="`${id}-listbox`"
        role="listbox"
        class="absolute z-20 inset-x-0  top-full mt-1 max-h-56 overflow-auto rounded-md border border-line bg-card py-1 shadow-1"
      >
        <li
          v-if="loading && suggestions.length === 0"
          class="px-3 py-2 text-sm text-ink-3"
        >
          {{ t('common.info.loading') }}
        </li>
        <li
          v-for="(row, index) in suggestions"
          :id="`${id}-option-${index}`"
          :key="row.key"
          role="option"
          :aria-selected="index === activeIndex"
          class="cursor-pointer px-3 py-2 text-sm text-ink"
          :class="index === activeIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover'"
          @mousedown.prevent="selectSuggestion(row)"
        >
          {{ row.name }}
        </li>
      </ul>
    </div>
    <p
      v-if="showErrorSlot"
      :id="`${id}-error`"
      class="mt-1 text-xs/snug min-h-5 line-clamp-2"
      :class="showError ? 'text-red-500' : 'invisible'"
      aria-live="polite"
    >
      {{ errorMsg || '\u00a0' }}
    </p>
  </div>
</template>
