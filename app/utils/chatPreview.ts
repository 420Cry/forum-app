export type ChatPreviewMessage = {
  messageType?: string
  message?: string
}

export type ChatPreviewPeer = {
  userId: string
  nickname?: string
  profileUrl?: string
}

/** Last-message preview for the conversation list. */
export function chatLastMessagePreview(
  lastMessage: ChatPreviewMessage | null | undefined,
  fileFallback: string,
): string {
  if (!lastMessage) return ''
  if (lastMessage.messageType === 'file') return fileFallback
  return lastMessage.message?.trim() ?? ''
}

export function chatPeerFromMembers(
  members: ChatPreviewPeer[] | undefined,
  myUserId: string,
): ChatPreviewPeer {
  const peer = members?.find(member => member.userId && member.userId !== myUserId)
  if (peer) return peer
  return { userId: '', nickname: '', profileUrl: '' }
}

export function shouldShowDaySeparator(
  currentCreatedAt: number,
  previousCreatedAt: number | null,
): boolean {
  if (previousCreatedAt == null) return true
  const current = new Date(currentCreatedAt)
  const previous = new Date(previousCreatedAt)
  return (
    current.getFullYear() !== previous.getFullYear()
    || current.getMonth() !== previous.getMonth()
    || current.getDate() !== previous.getDate()
  )
}

export function formatChatTime(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatChatListTime(
  timestamp: number,
  locale: string,
  yesterdayLabel: string,
): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  )
  if (diffDays === 0) return formatChatTime(timestamp, locale)
  if (diffDays === 1) return yesterdayLabel
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function formatChatDayLabel(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(timestamp))
}

/** Oldest → newest so the thread reads top-to-bottom like a normal chat. */
export function sortMessagesChronological<T extends { createdAt: number }>(
  messages: readonly T[],
): T[] {
  return [...messages].sort((a, b) => a.createdAt - b.createdAt)
}

const CHAIN_WINDOW_MS = 60_000

/**
 * Same sender within one minute — used for grouped bubble corners
 * (Sendbird UIKit chainTop / chainBottom pattern).
 */
export function isMessageChained(
  current: { createdAt: number, senderId: string | null | undefined },
  other: { createdAt: number, senderId: string | null | undefined } | null | undefined,
): boolean {
  if (!other?.senderId || !current.senderId) return false
  if (other.senderId !== current.senderId) return false
  return Math.abs(current.createdAt - other.createdAt) < CHAIN_WINDOW_MS
}

/** CSS border-radius for a speech bubble (outgoing vs incoming, chain ends). */
export function chatBubbleBorderRadius(
  isMine: boolean,
  chainTop: boolean,
  chainBottom: boolean,
): string {
  if (isMine) {
    const tr = chainTop ? '4px' : '14px'
    const br = !chainTop || chainBottom ? '4px' : '14px'
    return `14px ${tr} ${br} 14px`
  }
  const tl = chainTop ? '4px' : '14px'
  const bl = !chainTop || chainBottom ? '4px' : '14px'
  return `${tl} 14px 14px ${bl}`
}
