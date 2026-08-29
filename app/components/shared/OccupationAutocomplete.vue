<script lang="ts" setup>
import type { CatalogOccupation } from '~/types/catalogOccupations'
import { useOccupationsApi } from '~/composables/api/useOccupationsApi'
import { useCatalogCombobox } from '~/composables/ui/useCatalogCombobox'
import {
  catalogAutocompleteInput,
  type CatalogAutocompleteInputIntent,
} from '~/utils/catalogAutocompleteInput'
import { textToTagKey } from '~/utils/tagKey'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })
const displayName = defineModel<string>('displayName', { default: '' })

const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    placeholder?: string
    intent?: CatalogAutocompleteInputIntent
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

const { t, locale } = useI18n()
const { searchOccupations, resolveOccupationName } = useOccupationsApi()
const disabledRef = computed(() => props.disabled)

const CUSTOM_KEY = '__custom__'

type OccupationRow = CatalogOccupation & { custom?: boolean }

const {
  rootEl,
  listboxEl,
  query,
  open,
  loading,
  loadingMore,
  listRows,
  activeIndex,
  onInput,
  onFocus,
  onBlur,
  onKeydown,
  onListboxScroll,
  selectSuggestion,
} = useCatalogCombobox<OccupationRow>({
  id: props.id,
  model,
  displayName,
  disabled: disabledRef,
  // BE owns translations + locale-aware typeahead (`?locale=`).
  search: (q, offset) => searchOccupations(q, offset),
  searchErrorFallback: t('onboard.error.occupation_search_failed'),
  emitChange: () => emit('change'),
  emitSearchError: message => emit('searchError', message),
  listRows: ({ suggestions, query: q }) =>
    computed(() => {
      const rows = suggestions.value
      const raw = q.value.trim()
      if (raw.length < 2) return rows
      const needle = raw.toLowerCase()
      const hasExact = rows.some(
        row =>
          row.name.toLowerCase() === needle
          || row.key === textToTagKey(raw),
      )
      if (hasExact) return rows
      return [
        ...rows,
        {
          key: CUSTOM_KEY,
          name: t('onboard.action.use_custom_occupation', { query: raw }),
          custom: true,
        },
      ]
    }),
})

function selectCustom(raw: string) {
  const trimmed = raw.trim()
  if (trimmed.length < 2) return
  model.value = textToTagKey(trimmed)
  displayName.value = trimmed
  query.value = trimmed
  emit('change')
}

function onSelect(row: OccupationRow) {
  if (row.custom) {
    selectCustom(query.value)
    return
  }
  selectSuggestion(row)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && open.value) {
    const row = listRows.value[activeIndex.value]
    if (row?.custom) {
      event.preventDefault()
      selectCustom(query.value)
      open.value = false
      return
    }
  }
  onKeydown(event)
}

async function refreshDisplayName() {
  if (!model.value) return
  const name = await resolveOccupationName(model.value)
  // Custom free-text keys are not in the corpus — keep typed label.
  if (!name) return
  displayName.value = name
  // Input binds to `query`; combobox also syncs from displayName when closed.
  if (!open.value) query.value = name
}

watch(
  () => [model.value, displayName.value] as const,
  ([key, name]) => {
    if (!key || name) return
    void refreshDisplayName()
  },
  { immediate: true },
)

// Prefix locale switch remounts the page with locale already set — must run
// immediately so a stored EN displayName is re-resolved for VN (and vice versa).
watch(
  locale,
  () => {
    if (!model.value) return
    void refreshDisplayName()
  },
  { immediate: true },
)

const showError = computed(
  () => props.intent === 'error' && !!props.errorMsg,
)
const showErrorSlot = computed(() => {
  if (showError.value) return true
  if (props.reserveError !== undefined) return props.reserveError
  return !!props.label
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
        :class="catalogAutocompleteInput({ intent })"
        :aria-invalid="showError ? true : undefined"
        :aria-describedby="showError ? `${id}-error` : undefined"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="handleKeydown"
      >
      <ul
        v-if="open && (listRows.length > 0 || loading)"
        :id="`${id}-listbox`"
        ref="listboxEl"
        role="listbox"
        class="absolute z-20 inset-x-0 top-full mt-1 max-h-56 overflow-auto rounded-md border border-line bg-card py-1 shadow-1"
        @scroll="onListboxScroll"
      >
        <li
          v-if="loading && listRows.length === 0"
          class="px-3 py-2"
        >
          <LoadingState
            size="sm"
            layout="inline"
            padding="none"
          />
        </li>
        <li
          v-for="(row, index) in listRows"
          :id="`${id}-option-${index}`"
          :key="row.key"
          role="option"
          :aria-selected="index === activeIndex"
          class="cursor-pointer px-3 py-2 text-sm text-ink"
          :class="[
            index === activeIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover',
            row.custom ? 'border-t border-line font-medium text-brand' : '',
          ]"
          @mousedown.prevent="onSelect(row)"
        >
          {{ row.name }}
        </li>
        <li
          v-if="loadingMore"
          class="px-3 py-2"
        >
          <LoadingState
            size="sm"
            layout="inline"
            padding="none"
          />
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
