import type { GroupChannel } from '@sendbird/chat/groupChannel'
import type { ChatSession } from '~/types/chat'

export const SENDBIRD_INBOX_HANDLER_ID = 'forum-inbox'

/** Refresh session this many ms before Sendbird expiresAt. */
export const SENDBIRD_SESSION_SKEW_MS = 60_000

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
let sessionExpiresAt = 0
/** Bumped on logout so in-flight connects do not republish a session. */
let connectEpoch = 0

export function getSendbirdGroupChannelApi(): GroupChannelModuleApi | null {
  return groupChannelApi
}

export function getSendbirdSdk(): SendbirdGroupSdk | null {
  return sdk
}

export function getSendbirdUserId(): string {
  return connectedUserId
}

export function isSendbirdSessionFresh(
  expiresAt: number,
  now = Date.now(),
  skewMs = SENDBIRD_SESSION_SKEW_MS,
): boolean {
  return Number.isFinite(expiresAt) && expiresAt > now + skewMs
}

async function dropConnectedSession(): Promise<void> {
  removeSendbirdInboxHandler()
  const current = sdk
  sdk = null
  connectedUserId = ''
  sessionExpiresAt = 0
  if (!current) return
  try {
    await current.disconnect()
  }
  catch {
    // Best-effort — session may already be dead.
  }
}

/** Tear down the in-memory Sendbird connection (call on logout). */
export async function disconnectSendbird(): Promise<void> {
  connectEpoch += 1
  connecting = null
  await dropConnectedSession()
}

/** Shared Sendbird client (session token from forum-api). */
export async function ensureSendbirdSdk(
  getSession: () => Promise<ChatSession>,
): Promise<SendbirdGroupSdk> {
  if (sdk && isSendbirdSessionFresh(sessionExpiresAt)) return sdk
  if (connecting) return connecting

  const epoch = connectEpoch
  connecting = (async () => {
    if (sdk) {
      await dropConnectedSession()
    }

    const session = await getSession()
    if (epoch !== connectEpoch) {
      throw new Error('Sendbird connect cancelled')
    }

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

    if (epoch !== connectEpoch) {
      try {
        await client.disconnect()
      }
      catch {
        // ignore
      }
      throw new Error('Sendbird connect cancelled')
    }

    connectedUserId = session.userId
    sessionExpiresAt = session.expiresAt
    sdk = client
    return client
  })()

  try {
    return await connecting
  }
  finally {
    if (connecting && epoch === connectEpoch) {
      connecting = null
    }
  }
}

export function removeSendbirdInboxHandler() {
  sdk?.groupChannel.removeGroupChannelHandler(SENDBIRD_INBOX_HANDLER_ID)
}
