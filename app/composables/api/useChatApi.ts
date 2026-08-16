import type { ChatChannelOpen, ChatSession, ChatUnread } from '~/types/chat'
import { useApiFetch } from './useApiFetch'

export function useChatApi() {
  const { apiFetch } = useApiFetch()

  async function getSession() {
    return apiFetch<ChatSession>('/chat/session')
  }

  async function openChannel(userId: string) {
    return apiFetch<ChatChannelOpen>('/chat/channels', {
      method: 'POST',
      body: { userId },
    })
  }

  async function getUnread() {
    return apiFetch<ChatUnread>('/chat/unread')
  }

  return { getSession, openChannel, getUnread }
}
