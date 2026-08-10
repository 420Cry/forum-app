import type { Ref } from 'vue'
import type { CatalogSearchResult } from '~/types/catalogSearch'

export type CatalogComboboxRow = { key: string, name: string }

type Options<T extends CatalogComboboxRow> = {
  id: string
  model: Ref<string>
  displayName: Ref<string>
  disabled: Ref<boolean>
  search: (query: string, offset: number) => Promise<CatalogSearchResult<T>>
  searchErrorFallback: string
  emitChange: () => void
  emitSearchError: (message: string) => void
  listRows?: (ctx: {
    suggestions: Ref<T[]>
    query: Ref<string>
  }) => ComputedRef<T[]>
  onBlurCommit?: () => boolean | undefined
  onEnterWhenClosed?: () => void
}

/** Shared combobox state for catalog autocompletes (location, occupation). */
export function useCatalogCombobox<T extends CatalogComboboxRow>(
  options: Options<T>,
) {
  const { t } = useI18n()

  const rootEl = ref<HTMLElement | null>(null)
  const listboxEl = ref<HTMLElement | null>(null)
  const query = ref('')
  const open = ref(false)
  const focused = ref(false)
  const loading = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(false)
  const suggestions = ref<T[]>([]) as Ref<T[]>
  const activeIndex = ref(-1)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let blurTimer: ReturnType<typeof setTimeout> | null = null
  let requestSeq = 0
  let activeQuery = ''

  const listRows = options.listRows
    ? options.listRows({ suggestions, query })
    : computed(() => suggestions.value)

  watch(
    () => options.displayName.value,
    (next) => {
      if (!open.value && next) query.value = next
    },
    { immediate: true },
  )

  watch(
    () => options.model.value,
    (key) => {
      // While the user is typing, clearSelection() empties the key before the
      // dropdown opens — never wipe the in-progress query in that window.
      if (!key && !open.value && !focused.value) {
        query.value = ''
        options.displayName.value = ''
      }
    },
  )

  watch(listRows, (rows, prev) => {
    if (!prev || rows.length <= prev.length) {
      activeIndex.value = rows.length > 0 ? 0 : -1
    }
    if (!loadingMore.value && rows.length > 0 && prev?.length === 0) {
      if (listboxEl.value) listboxEl.value.scrollTop = 0
    }
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
    const el = document.getElementById(
      `${options.id}-option-${activeIndex.value}`,
    )
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

  async function runSearch(raw: string, append = false) {
    const seq = ++requestSeq
    activeQuery = raw
    if (append) loadingMore.value = true
    else loading.value = true

    try {
      const offset = append ? suggestions.value.length : 0
      const result = await options.search(raw, offset)
      if (seq !== requestSeq) return

      suggestions.value = append
        ? [...suggestions.value, ...result.rows]
        : result.rows
      hasMore.value = result.hasMore
      open.value = focused.value
    }
    catch (err: unknown) {
      if (seq !== requestSeq) return
      if (!append) {
        suggestions.value = [] as T[]
        activeIndex.value = -1
      }
      const statusCode
        = err && typeof err === 'object' && 'statusCode' in err
          ? Number((err as { statusCode?: number }).statusCode)
          : 0
      const msg
        = err && typeof err === 'object' && 'statusMessage' in err
          ? String((err as { statusMessage?: string }).statusMessage)
          : options.searchErrorFallback
      options.emitSearchError(
        statusCode === 503 ? msg : options.searchErrorFallback,
      )
    }
    finally {
      if (seq === requestSeq) {
        loading.value = false
        loadingMore.value = false
      }
    }
  }

  function scheduleSearch(raw: string) {
    clearDebounce()
    const delay = raw.trim().length <= 1 ? 80 : 120
    debounceTimer = setTimeout(() => {
      void runSearch(raw)
    }, delay)
  }

  function clearSelection() {
    if (!options.model.value) return
    options.model.value = ''
    options.displayName.value = ''
    options.emitChange()
  }

  function selectSuggestion(row: T) {
    options.model.value = row.key
    options.displayName.value = row.name
    query.value = row.name
    closeDropdown()
    suggestions.value = [] as T[]
    hasMore.value = false
    options.emitChange()
  }

  function syncQueryFromSelection() {
    if (options.model.value && options.displayName.value) {
      query.value = options.displayName.value
      return
    }
    if (!options.model.value) query.value = ''
  }

  function onInput(event: Event) {
    const el = event.target as HTMLInputElement
    query.value = el.value
    clearSelection()
    // Open immediately so listRows can show while the debounced search runs.
    open.value = focused.value
    scheduleSearch(el.value)
  }

  function onFocus() {
    if (options.disabled.value) return
    focused.value = true
    clearBlurTimer()
    void runSearch(query.value)
  }

  function onBlur() {
    focused.value = false
    clearDebounce()
    clearBlurTimer()
    blurTimer = setTimeout(() => {
      closeDropdown()
      const handled = options.onBlurCommit?.() === true
      if (!handled) syncQueryFromSelection()
    }, 120)
  }

  function onListboxScroll(event: Event) {
    const el = event.target as HTMLElement
    if (loading.value || loadingMore.value || !hasMore.value) return
    if (el.scrollTop + el.clientHeight < el.scrollHeight - 24) return
    void runSearch(activeQuery, true)
  }

  function onDocumentScroll(event: Event) {
    if (!open.value) return
    const target = event.target
    if (target instanceof Node && rootEl.value?.contains(target)) return
    closeDropdown()
    syncQueryFromSelection()
  }

  function onKeydown(event: KeyboardEvent) {
    const rows = listRows.value
    if (!open.value || rows.length === 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        void runSearch(query.value)
      }
      else if (event.key === 'Enter') {
        event.preventDefault()
        options.onEnterWhenClosed?.()
      }
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % rows.length
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + rows.length) % rows.length
    }
    else if (event.key === 'Enter') {
      event.preventDefault()
      const row = rows[activeIndex.value]
      if (row) selectSuggestion(row)
    }
    else if (event.key === 'Escape') {
      open.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('scroll', onDocumentScroll, true)
  })

  onBeforeUnmount(() => {
    clearDebounce()
    clearBlurTimer()
    document.removeEventListener('scroll', onDocumentScroll, true)
  })

  return {
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
    syncQueryFromSelection,
    t,
  }
}
