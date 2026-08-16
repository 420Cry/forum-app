import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import type { ChatListItem, ChatPeer } from '~/types/chat'
import {
  chatLastMessagePreview,
  chatPeerFromMembers,
  sortMessagesChronological,
} from '~/utils/chatPreview'

export function channelToPeer(
  channel: GroupChannel,
  myUserId: string,
): ChatPeer {
  const raw = chatPeerFromMembers(
    channel.members?.map(member => ({
      userId: member.userId,
      nickname: member.nickname,
      profileUrl: member.profileUrl,
    })),
    myUserId,
  )
  return {
    userId: raw.userId,
    nickname: raw.nickname?.trim() || 'Member',
    profileUrl: raw.profileUrl?.trim() || '',
  }
}

export function channelToListItem(
  channel: GroupChannel,
  myUserId: string,
  fileFallback: string,
): ChatListItem {
  const last = channel.lastMessage as UserMessage | null
  return {
    url: channel.url,
    peer: channelToPeer(channel, myUserId),
    lastMessage: chatLastMessagePreview(
      last
        ? { messageType: last.messageType, message: last.message }
        : null,
      fileFallback,
    ),
    lastMessageAt: last?.createdAt ?? channel.createdAt,
    unread: channel.unreadMessageCount,
  }
}

/** Replace by messageId, or append + re-sort if the id is new. */
export function replaceMessage(
  list: BaseMessage[],
  next: BaseMessage,
): BaseMessage[] {
  const id = next.messageId
  let found = false
  const mapped = list.map((message) => {
    if (message.messageId === id) {
      found = true
      return next
    }
    return message
  })
  return found ? mapped : sortMessagesChronological([...list, next])
}
