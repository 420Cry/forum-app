import { describe, expect, it } from 'vitest'
import {
  findLiveMessage,
  hasReactionFrom,
  isReactable,
  mergeMessages,
  replaceMessage,
} from '~/utils/chatMessages'

function msg(id: number, createdAt: number) {
  return { messageId: id, createdAt } as never
}

describe('replaceMessage', () => {
  it('replaces an existing message by id', () => {
    const list = [msg(1, 10), msg(2, 20)]
    const next = msg(2, 25)
    const out = replaceMessage(list, next)
    expect(out).toHaveLength(2)
    expect(out[1]).toBe(next)
  })

  it('appends and sorts when id is new', () => {
    const list = [msg(1, 30), msg(2, 10)]
    const next = msg(3, 20)
    const out = replaceMessage(list, next)
    expect(out.map(m => m.messageId)).toEqual([2, 3, 1])
  })

  it('upgrades a pending message matched by reqId', () => {
    const pending = { messageId: 0, reqId: 'req-a', createdAt: 10 } as never
    const succeeded = { messageId: 99, reqId: 'req-a', createdAt: 11 } as never
    const out = replaceMessage([pending], succeeded)
    expect(out).toHaveLength(1)
    expect(out[0]).toBe(succeeded)
  })
})

describe('mergeMessages', () => {
  it('keeps a local message the refetched history has not caught up to', () => {
    const known = [msg(1, 10), { messageId: 2, reqId: 'req-a', createdAt: 20 } as never]
    const out = mergeMessages(known, [msg(1, 10)])
    expect(out.map(m => m.messageId)).toEqual([1, 2])
  })

  it('returns the fetched list untouched when nothing is missing', () => {
    const fetched = [msg(1, 10), msg(2, 20)]
    expect(mergeMessages([msg(1, 10)], fetched)).toBe(fetched)
  })

  it('does not duplicate a pending message the server now returns', () => {
    const pending = { messageId: 0, reqId: 'req-a', createdAt: 20 } as never
    const stored = { messageId: 9, reqId: 'req-a', createdAt: 20 } as never
    expect(mergeMessages([pending], [stored])).toHaveLength(1)
  })
})

describe('findLiveMessage', () => {
  it('resolves a stale pending reference to the succeeded entry', () => {
    const stale = { messageId: 0, reqId: 'req-a' } as never
    const live = { messageId: 42, reqId: 'req-a' } as never
    expect(findLiveMessage([live], stale)).toBe(live)
  })

  it('falls back to the given message when the list has no match', () => {
    const orphan = { messageId: 7, reqId: 'req-z' } as never
    expect(findLiveMessage([msg(1, 10)], orphan)).toBe(orphan)
  })
})

describe('isReactable', () => {
  it.each([
    ['pending', { messageId: 0, sendingStatus: 'pending' }, false],
    ['scheduled', { messageId: 0, sendingStatus: 'scheduled' }, false],
    ['idless', { messageId: 0, sendingStatus: 'succeeded' }, false],
    ['succeeded', { messageId: 5, sendingStatus: 'succeeded' }, true],
  ])('%s → %s', (_label, message, expected) => {
    expect(isReactable(message as never)).toBe(expected)
  })
})

describe('hasReactionFrom', () => {
  const message = {
    messageId: 5,
    reactions: [{ key: '👍', userIds: ['me'] }],
  } as never

  it('detects my own reaction', () => {
    expect(hasReactionFrom(message, '👍', 'me')).toBe(true)
  })

  it('ignores reactions from other users and other emojis', () => {
    expect(hasReactionFrom(message, '👍', 'peer')).toBe(false)
    expect(hasReactionFrom(message, '🎉', 'me')).toBe(false)
  })
})
