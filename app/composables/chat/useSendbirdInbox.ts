import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import { useChatApi } from '~/composables/api/useChatApi'
import {
  SENDBIRD_INBOX_HANDLER_ID,
  ensureSendbirdSdk,
  getSendbirdGroupChannelApi,
  getSendbirdSdk,
  getSendbirdUserId,
  removeSendbirdInboxHandler,
  type SendbirdGroupSdk,
} from '~/composables/chat/useSendbirdClient'
import type { ChatListItem } from '~/types/chat'
import {
  channelToListItem,
  replaceMessage,
} from '~/utils/chatChannel'
import { sortMessagesChronological } from '~/utils/chatPreview'
import { chatDeliveryStatus, type ChatDeliveryStatus } from '~/utils/chatStatus'

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
  const threadChannel = ref<GroupChannel | null>(null)
  const receiptEpoch = ref(0)

  const selected = computed(
    () => channels.value.find(item => item.url === selectedUrl.value) ?? null,
  )
  const fileFallback = computed(() => t('chat.info.sent_file'))

  async function ensureSdk(): Promise<SendbirdGroupSdk> {
    const client = await ensureSendbirdSdk(getSession)
    myUserId.value = getSendbirdUserId()
    return client
  }

  function upsertChannel(channel: GroupChannel) {
    const item = channelToListItem(channel, myUserId.value, fileFallback.value)
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
    const api = getSendbirdGroupChannelApi()
    if (!api) return
    instance.groupChannel.removeGroupChannelHandler(SENDBIRD_INBOX_HANDLER_ID)
    const handler = new api.GroupChannelHandler({
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
    instance.groupChannel.addGroupChannelHandler(
      SENDBIRD_INBOX_HANDLER_ID,
      handler,
    )
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
      .map(channel =>
        channelToListItem(channel, myUserId.value, fileFallback.value),
      )
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
  }

  async function connect() {
    if (!import.meta.client) return
    const existing = getSendbirdSdk()
    if (status.value === 'ready' && existing) {
      myUserId.value = getSendbirdUserId()
      bindHandler(existing)
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
    removeSendbirdInboxHandler()
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
