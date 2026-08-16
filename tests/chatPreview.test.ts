import { describe, expect, it } from 'vitest'
import {
  chatBubbleBorderRadius,
  chatLastMessagePreview,
  chatPeerFromMembers,
  isMessageChained,
  shouldShowDaySeparator,
  sortMessagesChronological,
} from '~/utils/chatPreview'

describe('chatLastMessagePreview', () => {
  it('returns empty string without a last message', () => {
    expect(chatLastMessagePreview(null, 'Sent a file')).toBe('')
  })

  it('returns the text of a user message', () => {
    expect(
      chatLastMessagePreview(
        { messageType: 'user', message: ' Hello there ' },
        'Sent a file',
      ),
    ).toBe('Hello there')
  })

  it('uses the file fallback for file messages', () => {
    expect(
      chatLastMessagePreview({ messageType: 'file', message: 'img.png' }, 'Sent a file'),
    ).toBe('Sent a file')
  })
})

describe('chatPeerFromMembers', () => {
  it('returns the other member', () => {
    const peer = chatPeerFromMembers(
      [
        { userId: 'me', nickname: 'Alex' },
        { userId: 'them', nickname: 'Jordan', profileUrl: 'https://cdn/j.png' },
      ],
      'me',
    )
    expect(peer).toEqual({
      userId: 'them',
      nickname: 'Jordan',
      profileUrl: 'https://cdn/j.png',
    })
  })

  it('still returns peer identity when profileUrl is omitted', () => {
    const peer = chatPeerFromMembers(
      [
        { userId: 'me', nickname: 'Alex' },
        { userId: 'them', nickname: 'Jordan' },
      ],
      'me',
    )
    expect(peer).toEqual({
      userId: 'them',
      nickname: 'Jordan',
    })
  })
})

describe('shouldShowDaySeparator', () => {
  it('shows a separator for the first message', () => {
    expect(shouldShowDaySeparator(Date.parse('2026-08-16T10:00:00Z'), null)).toBe(
      true,
    )
  })

  it('hides a separator for the same calendar day', () => {
    expect(
      shouldShowDaySeparator(
        Date.parse('2026-08-16T18:00:00Z'),
        Date.parse('2026-08-16T09:00:00Z'),
      ),
    ).toBe(false)
  })
})

describe('sortMessagesChronological', () => {
  it('orders oldest to newest', () => {
    expect(
      sortMessagesChronological([
        { createdAt: 300, id: 'c' },
        { createdAt: 100, id: 'a' },
        { createdAt: 200, id: 'b' },
      ]).map(m => m.id),
    ).toEqual(['a', 'b', 'c'])
  })
})

describe('isMessageChained', () => {
  it('chains same sender within a minute', () => {
    expect(
      isMessageChained(
        { createdAt: 60_000, senderId: 'a' },
        { createdAt: 90_000, senderId: 'a' },
      ),
    ).toBe(true)
  })

  it('does not chain different senders or distant times', () => {
    expect(
      isMessageChained(
        { createdAt: 60_000, senderId: 'a' },
        { createdAt: 61_000, senderId: 'b' },
      ),
    ).toBe(false)
    expect(
      isMessageChained(
        { createdAt: 0, senderId: 'a' },
        { createdAt: 120_000, senderId: 'a' },
      ),
    ).toBe(false)
  })
})

describe('chatBubbleBorderRadius', () => {
  it('matches chained speech-bubble corners for outgoing', () => {
    expect(chatBubbleBorderRadius(true, false, false)).toBe('14px 14px 4px 14px')
    expect(chatBubbleBorderRadius(true, true, true)).toBe('14px 4px 4px 14px')
  })
})
