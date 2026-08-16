export type ChatSession = {
  appId: string
  userId: string
  /** BE-issued Sendbird session token (not a permanent access token). */
  token: string
  expiresAt: number
}

export type ChatChannelOpen = {
  channelUrl: string
}

export type ChatUnread = {
  unread: number
}

export type ChatPeer = {
  userId: string
  nickname: string
  profileUrl: string
}

export type ChatListItem = {
  url: string
  peer: ChatPeer
  lastMessage: string
  lastMessageAt: number
  unread: number
}
