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

type ListRow = CatalogOccupation & { freeText?: boolean }

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

const { t } = useI18n()
const { searchOccupations } = useOccupationsApi()
const disabledRef = computed(() => props.disabled)

function buildListRows({
  suggestions,
  query,
}: {
  suggestions: Ref<CatalogOccupation[]>
  query: Ref<string>
}) {
  return computed((): ListRow[] => {
    const rows = [...suggestions.value]
    const otherIdx = rows.findIndex(
      r => r.key === 'occupation_other' || r.key.endsWith('_other'),
    )
    const others = otherIdx >= 0 ? rows.splice(otherIdx, 1) : []
    const raw = query.value.trim()
    if (raw.length >= 2) {
      const key = textToTagKey(raw)
      const exactLabel = suggestions.value.some(
        o => o.name.toLowerCase() === raw.toLowerCase(),
      )
      const exactKey = suggestions.value.some(o => o.key === key)
      if (!exactLabel && !exactKey) {
        rows.push({ key, name: raw, freeText: true })
      }
    }
    return [...rows, ...others]
  })
}

const {
  rootEl,
  listboxEl,
  query,
  open,
  loading,
  listRows,
  activeIndex,
  onInput,
  onFocus,
  onBlur,
  onKeydown,
  selectSuggestion,
} = useCatalogCombobox<ListRow>({
  id: props.id,
  model,
  displayName,
  disabled: disabledRef,
  search: searchOccupations,
  listRows: buildListRows,
  searchErrorFallback: t('onboard.error.occupation_search_failed'),
  emitChange: () => emit('change'),
  emitSearchError: message => emit('searchError', message),
  onBlurCommit: () => {
    if (model.value && displayName.value) {
      query.value = displayName.value
      return true
    }
    if (!model.value && query.value.trim().length >= 2) {
      return commitFreeTextIfNeeded()
    }
    return false
  },
  onEnterWhenClosed: () => {
    commitFreeTextIfNeeded()
  },
})

function commitFreeTextIfNeeded(): boolean {
  const raw = query.value.trim()
  if (raw.length < 2) return false
  const key = textToTagKey(raw)
  const row = listRows.value.find(
    r => r.freeText && r.key === key,
  ) ?? listRows.value.find(
    r => !r.freeText && (r.key === key || r.name.toLowerCase() === raw.toLowerCase()),
  )
  if (row) {
    selectSuggestion(row)
    return true
  }
  selectSuggestion({ key, name: raw, freeText: true })
  return true
}

const showError = computed(
  () => props.intent === 'error' && !!props.errorMsg,
)
const showErrorSlot = computed(() => {
  if (showError.value) return true
  if (props.reserveError !== undefined) return props.reserveError
  return !!props.label
})

function optionLabel(row: ListRow) {
  if (row.freeText) {
    return t('onboard.action.use_custom_occupation', { query: row.name })
  }
  return row.name
}
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
