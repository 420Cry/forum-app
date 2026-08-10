<script lang="ts" setup>
import type { CatalogLocation } from '~/types/catalogLocations'
import { useLocationsApi } from '~/composables/api/useLocationsApi'
import { useCatalogCombobox } from '~/composables/ui/useCatalogCombobox'
import {
  catalogAutocompleteInput,
  type CatalogAutocompleteInputIntent,
} from '~/utils/catalogAutocompleteInput'
import { locationCatalogLabel } from '~/utils/catalogLabel'

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

const { t, te } = useI18n()
const { searchLocations } = useLocationsApi()
const disabledRef = computed(() => props.disabled)

function labelFor(row: CatalogLocation): string {
  return locationCatalogLabel(row.key, row.name, t, te)
}

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
} = useCatalogCombobox<CatalogLocation>({
  id: props.id,
  model,
  displayName,
  disabled: disabledRef,
  search: async (q, offset) => {
    const result = await searchLocations(q, offset)
    return {
      ...result,
      rows: result.rows.map(row => ({ ...row, name: labelFor(row) })),
    }
  },
  searchErrorFallback: t('onboard.error.location_search_failed'),
  emitChange: () => emit('change'),
  emitSearchError: message => emit('searchError', message),
})

watch(
  () => [model.value, displayName.value] as const,
  ([key, name]) => {
    if (!key || name) return
    displayName.value = locationCatalogLabel(key, key, t, te)
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
        @keydown="onKeydown"
      >
      <ul
        v-if="open && (listRows.length > 0 || loading)"
        :id="`${id}-listbox`"
        ref="listboxEl"
        role="listbox"
        class="absolute z-20 inset-x-0  top-full mt-1 max-h-56 overflow-auto rounded-md border border-line bg-card py-1 shadow-1"
        @scroll="onListboxScroll"
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
          :key="row.key"
          role="option"
          :aria-selected="index === activeIndex"
          class="cursor-pointer px-3 py-2 text-sm text-ink"
          :class="index === activeIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover'"
          @mousedown.prevent="selectSuggestion(row)"
        >
          {{ row.name }}
        </li>
        <li
          v-if="loadingMore"
          class="px-3 py-2 text-sm text-ink-3"
        >
          {{ t('common.info.loading') }}
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
