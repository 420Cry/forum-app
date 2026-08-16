import { describe, expect, it } from 'vitest'
import { replaceMessage } from '~/utils/chatChannel'

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
})
