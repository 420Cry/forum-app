// Composer open/close toggle. Shared via useState so any surface (feed
// placeholder, action buttons) can open it. The draft itself lives inside
// PostComposer — it's ephemeral and recreated each time the modal opens.
export const useUpload = () => {
  const isComposerOpen = useState<boolean>('is-composer-open', () => false)

  const openComposer = () => {
    isComposerOpen.value = true
  }

  const closeComposer = () => {
    isComposerOpen.value = false
  }

  return {
    isComposerOpen,
    openComposer,
    closeComposer,
  }
}
