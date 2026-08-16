export type ChatDeliveryStatus = 'pending' | 'failed' | 'sent' | 'delivered' | 'seen'

/**
 * Map Sendbird sending + delivery/read receipt counts to a UI status.
 * Counts come from GroupChannel.getUndeliveredMemberCount / getUnreadMemberCount
 * (excluding self and sender; for DMs: 0 means the peer got / read it).
 */
export function chatDeliveryStatus(input: {
  isMine: boolean
  sendingStatus?: string | null
  undeliveredCount: number
  unreadCount: number
}): ChatDeliveryStatus | null {
  if (!input.isMine) return null
  const sending = (input.sendingStatus ?? 'succeeded').toLowerCase()
  if (sending === 'pending' || sending === 'scheduled') return 'pending'
  if (sending === 'failed' || sending === 'canceled') return 'failed'
  if (input.undeliveredCount > 0) return 'sent'
  if (input.unreadCount > 0) return 'delivered'
  return 'seen'
}

export type ChatReactionSummary = {
  key: string
  count: number
  reactedByMe: boolean
}

/** Normalize Sendbird message.reactions for the bubble UI. */
export function chatReactionSummaries(
  reactions: ReadonlyArray<{ key: string, userIds?: string[] }> | null | undefined,
  myUserId: string,
): ChatReactionSummary[] {
  if (!reactions?.length) return []
  return reactions
    .map(reaction => ({
      key: reaction.key,
      count: reaction.userIds?.length ?? 0,
      reactedByMe: !!myUserId && (reaction.userIds?.includes(myUserId) ?? false),
    }))
    .filter(reaction => reaction.count > 0)
    .sort((a, b) => a.key.localeCompare(b.key))
}

/** Quick-react set (Unicode keys — works with Sendbird reaction keys). */
export const CHAT_QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const
