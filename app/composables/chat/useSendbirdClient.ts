import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { ChatSession } from '~/types/chat'

export const SENDBIRD_INBOX_HANDLER_ID = 'forum-inbox'

export type SendbirdGroupSdk = {
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

type GroupChannelModuleApi = typeof import('@sendbird/chat/groupChannel')

let sdk: SendbirdGroupSdk | null = null
let client: SendbirdGroupSdk | null = null
let connecting: Promise<SendbirdGroupSdk> | null = null
let groupChannelApi: GroupChannelModuleApi | null = null
let connectedUserId = ''

export function getSendbirdGroupChannelApi(): GroupChannelModuleApi | null {
  return groupChannelApi
}

export function getSendbirdSdk(): SendbirdGroupSdk | null {
  return sdk
}

export function getSendbirdUserId(): string {
  return connectedUserId
}

/** Shared Sendbird client (session token from forum-api). */
export async function ensureSendbirdSdk(
  getSession: () => Promise<ChatSession>,
): Promise<SendbirdGroupSdk> {
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
    connectedUserId = session.userId
    sdk = client
    return client
  })()

  try {
    return await connecting
  }
  finally {
    connecting = null
  }
}

export function removeSendbirdInboxHandler() {
  sdk?.groupChannel.removeGroupChannelHandler(SENDBIRD_INBOX_HANDLER_ID)
}
