import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import { sortMessagesChronological } from '~/utils/chatPreview'

/** Sendbird has not accepted these yet — they carry `messageId === 0`. */
const UNSENT_STATUSES = new Set(['pending', 'scheduled'])

function reqIdOf(message: BaseMessage): string {
  return String((message as UserMessage).reqId ?? '').trim()
}

/** Same message, matching a pending draft to the succeeded server copy. */
export function isSameMessage(a: BaseMessage, b: BaseMessage): boolean {
  if (a.messageId && a.messageId === b.messageId) return true
  const reqId = reqIdOf(a)
  return !!reqId && reqId === reqIdOf(b)
}

/** Replace in place, or append + re-sort when the message is new to the list. */
export function replaceMessage(
  list: BaseMessage[],
  next: BaseMessage,
): BaseMessage[] {
  let found = false
  const mapped = list.map((message) => {
    if (!isSameMessage(next, message)) return message
    found = true
    return next
  })
  return found ? mapped : sortMessagesChronological([...list, next])
}

/**
 * Server history plus any locally-known message it has not caught up to.
 * Sendbird history is eventually consistent, so a refetch moments after
 * sending can come back without the message the client already rendered.
 */
export function mergeMessages(
  known: BaseMessage[],
  fetched: BaseMessage[],
): BaseMessage[] {
  const missing = known.filter(
    item => !fetched.some(next => isSameMessage(item, next)),
  )
  if (missing.length === 0) return fetched
  return sortMessagesChronological([...fetched, ...missing])
}

/**
 * The list entry for `message`. Sending swaps the pending object for the
 * succeeded one, so a reference held by the UI can be stale — and Sendbird
 * rejects reactions on stale/pending objects.
 */
export function findLiveMessage(
  list: BaseMessage[],
  message: BaseMessage,
): BaseMessage {
  return list.find(item => isSameMessage(message, item)) ?? message
}

/** Reactions are only accepted once the server has assigned a message id. */
export function isReactable(message: BaseMessage): boolean {
  const status = String(
    (message as UserMessage).sendingStatus ?? '',
  ).toLowerCase()
  return !!message.messageId && !UNSENT_STATUSES.has(status)
}

/** Whether `userId` already reacted to `message` with `emoji`. */
export function hasReactionFrom(
  message: BaseMessage,
  emoji: string,
  userId: string,
): boolean {
  const summary = ((message as UserMessage).reactions ?? []).find(
    reaction => reaction.key === emoji,
  )
  return summary?.userIds?.includes(userId) ?? false
}
