import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import { useChatApi } from '~/composables/api/useChatApi'
import type { ChatListItem, ChatPeer } from '~/types/chat'
import {
  chatLastMessagePreview,
  chatPeerFromMembers,
  sortMessagesChronological,
} from '~/utils/chatPreview'
import { chatDeliveryStatus, type ChatDeliveryStatus } from '~/utils/chatStatus'

const HANDLER_ID = 'forum-inbox'

type SendbirdGroupSdk = {
  connect: (userId: string, token: string) => Promise<unknown>
  disconnect: () => Promise<void>
  groupChannel: {
    createMyGroupChannelListQuery: (params: {
      includeEmpty: boolean
      limit: number
      order: string
    }) => { next: () => Promise<GroupChannel[]> }
    getChannel: (url: string) => Promise<GroupChannel>
    addGroupChannelHandler: (id: string, handler: unknown) => void
    removeGroupChannelHandler: (id: string) => void
  }
}

let sdk: SendbirdGroupSdk | null = null
let client: SendbirdGroupSdk | null = null
let connecting: Promise<SendbirdGroupSdk> | null = null
let groupChannelApi: typeof import('@sendbird/chat/groupChannel') | null = null

function toPeer(channel: GroupChannel, myUserId: string): ChatPeer {
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

function toListItem(
  channel: GroupChannel,
  myUserId: string,
  fileFallback: string,
): ChatListItem {
  const last = channel.lastMessage as UserMessage | null
  return {
    url: channel.url,
    peer: toPeer(channel, myUserId),
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

function replaceMessage(list: BaseMessage[], next: BaseMessage): BaseMessage[] {
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

export function useSendbirdInbox() {
  const { getSession } = useChatApi()
  const { t } = useI18n()

  const status = ref<'idle' | 'loading' | 'ready' | 'unavailable' | 'error'>(
    'idle',
  )
  const myUserId = ref('')
  const channels = ref<ChatListItem[]>([])
  const selectedUrl = ref<string | null>(null)
  const messages = ref<BaseMessage[]>([])
  const sending = ref(false)
  const threadError = ref(false)
  /** Live GroupChannel for receipt + reaction APIs. */
  const threadChannel = ref<GroupChannel | null>(null)
  /** Bumped when delivery/read maps change so UI recomputes ticks. */
  const receiptEpoch = ref(0)

  const selected = computed(
    () => channels.value.find(item => item.url === selectedUrl.value) ?? null,
  )

  const fileFallback = computed(() => t('chat.info.sent_file'))

  async function ensureSdk(): Promise<SendbirdGroupSdk> {
    if (sdk) return sdk
    if (connecting) return connecting

    connecting = (async () => {
      const session = await getSession()
      const [{ default: SendbirdChat }, groupChannel] = await Promise.all([
        import('@sendbird/chat'),
        import('@sendbird/chat/groupChannel'),
      ])
      groupChannelApi = groupChannel
      if (!client) {
        client = SendbirdChat.init({
          appId: session.appId,
          modules: [new groupChannel.GroupChannelModule()],
        }) as unknown as SendbirdGroupSdk
      }
      // Session token from forum-api (Platform API). Access-token login is denied.
      await client.connect(session.userId, session.token)
      myUserId.value = session.userId
      sdk = client
      bindHandler(client)
      return client
    })()

    try {
      return await connecting
    }
    finally {
      connecting = null
    }
  }

  function upsertChannel(channel: GroupChannel) {
    const item = toListItem(channel, myUserId.value, fileFallback.value)
    const rest = channels.value.filter(row => row.url !== item.url)
    channels.value = [item, ...rest].sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt,
    )
  }

  function bumpReceipts(channel: GroupChannel) {
    if (channel.url === selectedUrl.value) {
      threadChannel.value = channel
      receiptEpoch.value += 1
    }
  }

  function bindHandler(instance: SendbirdGroupSdk) {
    if (!groupChannelApi) return
    instance.groupChannel.removeGroupChannelHandler(HANDLER_ID)
    const handler = new groupChannelApi.GroupChannelHandler({
      onMessageReceived: (channel, message) => {
        if (!channel.isGroupChannel()) return
        upsertChannel(channel)
        if (channel.url === selectedUrl.value) {
          messages.value = sortMessagesChronological([
            ...messages.value,
            message,
          ])
          threadChannel.value = channel
          void channel.markAsRead()
          void channel.markAsDelivered()
        }
      },
      onChannelChanged: (channel) => {
        if (!channel.isGroupChannel()) return
        upsertChannel(channel)
        bumpReceipts(channel)
      },
      onUndeliveredMemberStatusUpdated: (channel) => {
        if (!channel.isGroupChannel()) return
        bumpReceipts(channel)
      },
      onUnreadMemberStatusUpdated: (channel) => {
        if (!channel.isGroupChannel()) return
        bumpReceipts(channel)
      },
      onUserMarkedRead: (channel) => {
        if (!channel.isGroupChannel()) return
        bumpReceipts(channel)
      },
      onReactionUpdated: (channel, reactionEvent) => {
        if (!channel.isGroupChannel()) return
        if (channel.url !== selectedUrl.value) return
        const current = messages.value.find(
          message => message.messageId === reactionEvent.messageId,
        )
        if (!current) return
        current.applyReactionEvent(reactionEvent)
        messages.value = [...messages.value]
      },
    })
    instance.groupChannel.addGroupChannelHandler(HANDLER_ID, handler)
  }

  async function loadChannels() {
    const client = await ensureSdk()
    const query = client.groupChannel.createMyGroupChannelListQuery({
      includeEmpty: true,
      limit: 50,
      order: 'latest_last_message',
    })
    const list = await query.next()
    channels.value = list
      .map(channel => toListItem(channel, myUserId.value, fileFallback.value))
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
  }

  async function connect() {
    if (!import.meta.client) return
    if (status.value === 'ready' && sdk) {
      bindHandler(sdk)
      return
    }
    status.value = 'loading'
    try {
      const client = await ensureSdk()
      bindHandler(client)
      await loadChannels()
      status.value = 'ready'
    }
    catch (err) {
      const code = Number(
        (err as { statusCode?: number, status?: number }).statusCode
        ?? (err as { status?: number }).status
        ?? 0,
      )
      status.value = code === 503 ? 'unavailable' : 'error'
    }
  }

  async function openThread(url: string) {
    selectedUrl.value = url
    threadError.value = false
    messages.value = []
    threadChannel.value = null
    try {
      const client = await ensureSdk()
      const channel = await client.groupChannel.getChannel(url)
      threadChannel.value = channel
      const fetched = await channel.getMessagesByTimestamp(Date.now(), {
        prevResultSize: 50,
        nextResultSize: 0,
        reverse: false,
        includeReactions: true,
      })
      messages.value = sortMessagesChronological(fetched)
      await channel.markAsRead()
      void channel.markAsDelivered()
      upsertChannel(channel)
      receiptEpoch.value += 1
    }
    catch {
      threadError.value = true
    }
  }

  async function send(text: string) {
    const url = selectedUrl.value
    const trimmed = text.trim()
    if (!url || !trimmed || sending.value) return
    sending.value = true
    try {
      const client = await ensureSdk()
      const channel = await client.groupChannel.getChannel(url)
      threadChannel.value = channel
      await new Promise<void>((resolve, reject) => {
        channel
          .sendUserMessage({ message: trimmed })
          .onPending((message) => {
            messages.value = replaceMessage(messages.value, message)
          })
          .onSucceeded((message) => {
            messages.value = replaceMessage(messages.value, message)
            upsertChannel(channel)
            receiptEpoch.value += 1
            resolve()
          })
          .onFailed((error, message) => {
            if (message) {
              messages.value = replaceMessage(messages.value, message)
            }
            reject(error)
          })
      })
    }
    finally {
      sending.value = false
    }
  }

  function deliveryStatusFor(message: BaseMessage): ChatDeliveryStatus | null {
    // Depend on epoch so ticks refresh when receipt maps update.
    void receiptEpoch.value
    const channel = threadChannel.value
    const mine
      = (message as UserMessage).sender?.userId === myUserId.value
    if (!mine) return null
    const undelivered = channel?.getUndeliveredMemberCount(message) ?? 1
    const unread = channel?.getUnreadMemberCount(message) ?? 1
    return chatDeliveryStatus({
      isMine: true,
      sendingStatus: (message as UserMessage).sendingStatus,
      undeliveredCount: undelivered,
      unreadCount: unread,
    })
  }

  async function toggleReaction(message: BaseMessage, emoji: string) {
    const channel = threadChannel.value
    if (!channel || !emoji) return
    const summaries = (message as UserMessage).reactions ?? []
    const existing = summaries.find(reaction => reaction.key === emoji)
    const reactedByMe = existing?.userIds?.includes(myUserId.value) ?? false
    try {
      const event = reactedByMe
        ? await channel.deleteReaction(message, emoji)
        : await channel.addReaction(message, emoji)
      message.applyReactionEvent(event)
      messages.value = [...messages.value]
    }
    catch (err) {
      throw new Error('reaction_failed', { cause: err })
    }
  }

  function clearThread() {
    selectedUrl.value = null
    messages.value = []
    threadError.value = false
    threadChannel.value = null
  }

  onUnmounted(() => {
    if (!sdk) return
    sdk.groupChannel.removeGroupChannelHandler(HANDLER_ID)
  })

  return {
    status,
    myUserId,
    channels,
    selectedUrl,
    selected,
    messages,
    sending,
    threadError,
    receiptEpoch,
    connect,
    refreshChannels: loadChannels,
    openThread,
    send,
    deliveryStatusFor,
    toggleReaction,
    clearThread,
  }
}
