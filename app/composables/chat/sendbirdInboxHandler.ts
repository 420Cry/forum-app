import type { BaseChannel } from '@sendbird/chat'
import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { BaseMessage, ReactionEvent } from '@sendbird/chat/message'
import {
  SENDBIRD_INBOX_HANDLER_ID,
  getSendbirdGroupChannelApi,
  type SendbirdGroupSdk,
} from '~/composables/chat/useSendbirdClient'

export type InboxHandlers = {
  /** Channel metadata changed (last message, unread count, membership). */
  onChannelUpdated: (channel: GroupChannel) => void
  onMessageReceived: (channel: GroupChannel, message: BaseMessage) => void
  /** Delivery / read receipts moved. */
  onReceiptsUpdated: (channel: GroupChannel) => void
  onReactionUpdated: (channel: GroupChannel, event: ReactionEvent) => void
}

/** Sendbird fires channel events for every channel type; the inbox wants groups. */
function groupOnly<Args extends unknown[]>(
  handle: (channel: GroupChannel, ...args: Args) => void,
) {
  return (channel: BaseChannel, ...args: Args) => {
    if (!channel.isGroupChannel()) return
    handle(channel, ...args)
  }
}

/** (Re-)register the single inbox handler on the shared SDK instance. */
export function bindInboxHandler(
  sdk: SendbirdGroupSdk,
  handlers: InboxHandlers,
): void {
  const api = getSendbirdGroupChannelApi()
  if (!api) return
  sdk.groupChannel.removeGroupChannelHandler(SENDBIRD_INBOX_HANDLER_ID)
  sdk.groupChannel.addGroupChannelHandler(
    SENDBIRD_INBOX_HANDLER_ID,
    new api.GroupChannelHandler({
      onMessageReceived: groupOnly(handlers.onMessageReceived),
      onChannelChanged: groupOnly((channel) => {
        handlers.onChannelUpdated(channel)
        handlers.onReceiptsUpdated(channel)
      }),
      onUndeliveredMemberStatusUpdated: groupOnly(handlers.onReceiptsUpdated),
      onUnreadMemberStatusUpdated: groupOnly(handlers.onReceiptsUpdated),
      onUserMarkedRead: groupOnly(handlers.onReceiptsUpdated),
      onReactionUpdated: groupOnly(handlers.onReactionUpdated),
    }),
  )
}
