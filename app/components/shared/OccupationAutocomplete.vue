<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'
import type { CatalogOccupation } from '~/types/catalogOccupations'
import { useOccupationsApi } from '~/composables/api/useOccupationsApi'
import { textToTagKey } from '~/utils/tagKey'

defineOptions({ inheritAttrs: false })

type ListRow = CatalogOccupation & { freeText?: boolean }

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
const { searchOccupations } = useOccupationsApi()

const rootEl = ref<HTMLElement | null>(null)
const listboxEl = ref<HTMLElement | null>(null)
const query = ref('')
const open = ref(false)
const focused = ref(false)
const loading = ref(false)
const suggestions = ref<CatalogOccupation[]>([])
const activeIndex = ref(-1)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let blurTimer: ReturnType<typeof setTimeout> | null = null
let requestSeq = 0

const showError = computed(
  () => props.intent === 'error' && !!props.errorMsg,
)
const showErrorSlot = computed(() => {
  if (showError.value) return true
  if (props.reserveError !== undefined) return props.reserveError
  return !!props.label
})

const freeTextOption = computed((): ListRow | null => {
  const raw = query.value.trim()
  if (raw.length < 2) return null
  const key = textToTagKey(raw)
  const exactLabel = suggestions.value.some(
    o => o.name.toLowerCase() === raw.toLowerCase(),
  )
  const exactKey = suggestions.value.some(o => o.key === key)
  if (exactLabel || exactKey) return null
  return { key, name: raw, freeText: true }
})

const listRows = computed((): ListRow[] => {
  const rows = [...suggestions.value]
  const otherIdx = rows.findIndex(
    r => r.key === 'occupation_other' || r.key.endsWith('_other'),
  )
  const others
    = otherIdx >= 0 ? rows.splice(otherIdx, 1) : []
  if (freeTextOption.value) rows.push(freeTextOption.value)
  return [...rows, ...others]
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

watch(listRows, (rows) => {
  activeIndex.value = rows.length > 0 ? 0 : -1
  if (listboxEl.value) listboxEl.value.scrollTop = 0
})

function clearBlurTimer() {
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
}

function closeDropdown() {
  open.value = false
  activeIndex.value = -1
}

async function scrollActiveOptionIntoView() {
  if (activeIndex.value < 0) return
  await nextTick()
  const el = document.getElementById(`${props.id}-option-${activeIndex.value}`)
  el?.scrollIntoView({ block: 'nearest' })
}

watch(activeIndex, () => {
  void scrollActiveOptionIntoView()
})

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
    const rows = await searchOccupations(raw)
    if (seq !== requestSeq) return
    suggestions.value = rows
    open.value = focused.value
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
        : t('onboard.error.occupation_search_failed')
    emit(
      'searchError',
      statusCode === 503 ? msg : t('onboard.error.occupation_search_failed'),
    )
  }
  finally {
    if (seq === requestSeq) loading.value = false
  }
}

function scheduleSearch(raw: string) {
  clearDebounce()
  const delay = raw.trim().length <= 1 ? 80 : 120
  debounceTimer = setTimeout(() => {
    void runSearch(raw)
  }, delay)
}

function selectSuggestion(row: ListRow) {
  model.value = row.key
  displayName.value = row.name
  query.value = row.name
  open.value = false
  suggestions.value = []
  activeIndex.value = -1
  emit('change')
}

function commitFreeTextIfNeeded() {
  const raw = query.value.trim()
  if (raw.length < 2) return false
  const key = textToTagKey(raw)
  const known = suggestions.value.find(
    o =>
      o.key === key
      || o.name.toLowerCase() === raw.toLowerCase(),
  )
  if (known) {
    selectSuggestion(known)
    return true
  }
  selectSuggestion({ key, name: raw, freeText: true })
  return true
}

function onInput(event: Event) {
  const el = event.target as HTMLInputElement
  query.value = el.value
  if (model.value) {
    model.value = ''
    displayName.value = ''
    emit('change')
  }
  scheduleSearch(el.value)
}

function onFocus() {
  if (props.disabled) return
  focused.value = true
  clearBlurTimer()
  void runSearch(query.value)
}

function syncQueryFromSelection() {
  if (model.value && displayName.value) {
    query.value = displayName.value
    return
  }
  if (!model.value) query.value = ''
}

function onBlur() {
  focused.value = false
  clearDebounce()
  clearBlurTimer()
  blurTimer = setTimeout(() => {
    closeDropdown()
    if (model.value && displayName.value) {
      query.value = displayName.value
      return
    }
    if (!model.value && query.value.trim().length >= 2) {
      commitFreeTextIfNeeded()
      return
    }
    syncQueryFromSelection()
  }, 120)
}

function onDocumentScroll(event: Event) {
  if (!open.value) return
  const target = event.target
  if (target instanceof Node && rootEl.value?.contains(target)) return
  closeDropdown()
  syncQueryFromSelection()
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value || listRows.value.length === 0) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      void runSearch(query.value)
    }
    else if (event.key === 'Enter') {
      event.preventDefault()
      commitFreeTextIfNeeded()
    }
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % listRows.value.length
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value
      = (activeIndex.value - 1 + listRows.value.length) % listRows.value.length
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    const row = listRows.value[activeIndex.value]
    if (row) selectSuggestion(row)
  }
  else if (event.key === 'Escape') {
    open.value = false
  }
}

function optionLabel(row: ListRow) {
  if (row.freeText) {
    return t('onboard.action.use_custom_occupation', { query: row.name })
  }
  return row.name
}

onMounted(() => {
  document.addEventListener('scroll', onDocumentScroll, true)
})

onBeforeUnmount(() => {
  clearDebounce()
  clearBlurTimer()
  document.removeEventListener('scroll', onDocumentScroll, true)
})
</script>

<template>
  <div class="min-w-0 flex flex-col">
    <label
      v-if="label"
      class="block text-sm font-semibold text-ink-2 mb-1"
      :for="id"
    >{{ label }}</label>
    <div
      ref="rootEl"
      class="relative"
    >
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
        v-if="open && (listRows.length > 0 || loading)"
        :id="`${id}-listbox`"
        ref="listboxEl"
        role="listbox"
        class="absolute z-20 inset-x-0 top-full mt-1 max-h-56 overflow-auto rounded-md border border-line bg-card py-1 shadow-1"
      >
        <li
          v-if="loading && listRows.length === 0"
          class="px-3 py-2 text-sm text-ink-3"
        >
          {{ t('common.info.loading') }}
        </li>
        <li
          v-for="(row, index) in listRows"
          :id="`${id}-option-${index}`"
          :key="`${row.key}:${row.freeText ? 'free' : 'cat'}`"
          role="option"
          :aria-selected="index === activeIndex"
          class="cursor-pointer px-3 py-2 text-sm text-ink"
          :class="index === activeIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover'"
          @mousedown.prevent="selectSuggestion(row)"
        >
          {{ optionLabel(row) }}
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
