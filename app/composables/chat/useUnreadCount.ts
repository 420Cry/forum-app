import { useChatApi } from '~/composables/api/useChatApi'

const POLL_MS = 30_000

export function useUnreadCount() {
  const unread = useState('forum-chat-unread', () => 0)
  const { getUnread } = useChatApi()
  const session = useSupabaseSession()
  let timer: ReturnType<typeof setInterval> | null = null

  async function refresh() {
    if (!session.value?.access_token) {
      unread.value = 0
      return
    }
    try {
      const result = await getUnread()
      unread.value = Math.max(0, result.unread ?? 0)
    }
    catch {
      // Badge is best-effort — stay on the last known count.
    }
  }

  function start() {
    if (!import.meta.client) return
    void refresh()
    if (timer) return
    timer = setInterval(() => {
      void refresh()
    }, POLL_MS)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { unread, refresh, start, stop }
}
