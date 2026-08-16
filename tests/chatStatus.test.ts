import { describe, expect, it } from 'vitest'
import {
  chatDeliveryStatus,
  chatReactionSummaries,
} from '~/utils/chatStatus'

describe('chatDeliveryStatus', () => {
  it('returns null for incoming messages', () => {
    expect(
      chatDeliveryStatus({
        isMine: false,
        sendingStatus: 'succeeded',
        undeliveredCount: 0,
        unreadCount: 0,
      }),
    ).toBeNull()
  })

  it('maps pending and failed sending states', () => {
    expect(
      chatDeliveryStatus({
        isMine: true,
        sendingStatus: 'pending',
        undeliveredCount: 1,
        unreadCount: 1,
      }),
    ).toBe('pending')
    expect(
      chatDeliveryStatus({
        isMine: true,
        sendingStatus: 'failed',
        undeliveredCount: 1,
        unreadCount: 1,
      }),
    ).toBe('failed')
  })

  it('maps sent → delivered → seen from receipt counts', () => {
    expect(
      chatDeliveryStatus({
        isMine: true,
        sendingStatus: 'succeeded',
        undeliveredCount: 1,
        unreadCount: 1,
      }),
    ).toBe('sent')
    expect(
      chatDeliveryStatus({
        isMine: true,
        sendingStatus: 'succeeded',
        undeliveredCount: 0,
        unreadCount: 1,
      }),
    ).toBe('delivered')
    expect(
      chatDeliveryStatus({
        isMine: true,
        sendingStatus: 'succeeded',
        undeliveredCount: 0,
        unreadCount: 0,
      }),
    ).toBe('seen')
  })
})

describe('chatReactionSummaries', () => {
  it('filters empty reactions and marks mine', () => {
    expect(
      chatReactionSummaries(
        [
          { key: '👍', userIds: ['me', 'them'] },
          { key: '❤️', userIds: [] },
          { key: '😂', userIds: ['them'] },
        ],
        'me',
      ),
    ).toEqual([
      { key: '👍', count: 2, reactedByMe: true },
      { key: '😂', count: 1, reactedByMe: false },
    ])
  })
})
