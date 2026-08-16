import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { UserMessage } from '@sendbird/chat/message'
import type { ChatListItem, ChatPeer } from '~/types/chat'
import {
  chatLastMessagePreview,
  chatPeerFromMembers,
} from '~/utils/chatPreview'

export function channelToPeer(
  channel: GroupChannel,
  myUserId: string,
): ChatPeer {
  const raw = chatPeerFromMembers(
    channel.members?.map(member => ({
      userId: member.userId,
      nickname: member.nickname,
    })),
    myUserId,
  )
  return {
    userId: raw.userId,
    nickname: raw.nickname?.trim() || 'Member',
    // Avatars come from Forum (contacts), never from Sendbird profile_url.
    profileUrl: '',
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
