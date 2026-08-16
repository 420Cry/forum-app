export type ReactionAnchor = {
  left: number
  right: number
  top: number
  bottom: number
}

/**
 * Long-press / hover picker state for a message bubble.
 * Closes on scroll so a fixed Teleport bar does not float over the thread.
 */
export function useReactionPicker(opts: {
  bubbleRef: Ref<HTMLElement | null>
  wrapRef: Ref<HTMLElement | null>
}) {
  const open = ref(false)
  const anchor = ref<ReactionAnchor | null>(null)
  let ignoreCloseUntil = 0
  let longPressTimer: ReturnType<typeof setTimeout> | null = null
  let scrollRoot: HTMLElement | null = null

  function clearLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  function measureAnchor() {
    const el = opts.bubbleRef.value
    if (!el) return
    const box = el.getBoundingClientRect()
    anchor.value = {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
    }
  }

  function openPicker() {
    measureAnchor()
    ignoreCloseUntil = Date.now() + 400
    open.value = true
  }

  function closePicker(reason: string) {
    if (!open.value) return
    if (reason !== 'scroll' && Date.now() < ignoreCloseUntil) return
    open.value = false
  }

  function onOpenUpdate(value: boolean) {
    if (value) openPicker()
    else closePicker('child')
  }

  function onPointerDown() {
    clearLongPress()
    longPressTimer = setTimeout(() => {
      longPressTimer = null
      openPicker()
    }, 450)
  }

  function onPointerUp() {
    clearLongPress()
  }

  function onContextMenu(event: Event) {
    event.preventDefault()
    openPicker()
  }

  function onScrollClose() {
    closePicker('scroll')
  }

  function findScrollRoot(): HTMLElement | null {
    let node = opts.wrapRef.value?.parentElement ?? null
    while (node) {
      const style = getComputedStyle(node)
      if (/(auto|scroll)/.test(style.overflowY)) return node
      node = node.parentElement
    }
    return null
  }

  onMounted(() => {
    scrollRoot = findScrollRoot()
    scrollRoot?.addEventListener('scroll', onScrollClose, { passive: true })
    window.addEventListener('scroll', onScrollClose, { passive: true })
  })

  onUnmounted(() => {
    clearLongPress()
    scrollRoot?.removeEventListener('scroll', onScrollClose)
    window.removeEventListener('scroll', onScrollClose)
  })

  return {
    open,
    anchor,
    openPicker,
    onOpenUpdate,
    onPointerDown,
    onPointerUp,
    onContextMenu,
  }
}
