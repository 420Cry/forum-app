import { describe, expect, it, vi } from 'vitest'
import {
  buildAvatarObjectPath,
  takePickedFile,
  validateAvatarFile,
} from '~/utils/avatarUpload'

function makeFile(
  name: string,
  type: string,
  size: number,
): File {
  const blob = new Blob([new Uint8Array(size)], { type })
  return new File([blob], name, { type })
}

describe('validateAvatarFile', () => {
  it('accepts jpeg, png, and webp under 5 MB', () => {
    expect(validateAvatarFile(makeFile('a.jpg', 'image/jpeg', 100))).toBeNull()
    expect(validateAvatarFile(makeFile('a.png', 'image/png', 100))).toBeNull()
    expect(validateAvatarFile(makeFile('a.webp', 'image/webp', 100))).toBeNull()
  })

  it('rejects unsupported types', () => {
    expect(validateAvatarFile(makeFile('a.gif', 'image/gif', 100))).toBe(
      'settings.error.avatar_type',
    )
  })

  it('rejects files over 5 MB', () => {
    expect(
      validateAvatarFile(makeFile('big.jpg', 'image/jpeg', 5 * 1024 * 1024 + 1)),
    ).toBe('settings.error.avatar_size')
  })
})

describe('buildAvatarObjectPath', () => {
  it('builds a path with user id and extension from mime type', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    expect(buildAvatarObjectPath('user-1', makeFile('x.png', 'image/png', 10)))
      .toBe('user-1/1700000000000.png')
    expect(buildAvatarObjectPath('user-1', makeFile('x.webp', 'image/webp', 10)))
      .toBe('user-1/1700000000000.webp')
    expect(buildAvatarObjectPath('user-1', makeFile('x.jpg', 'image/jpeg', 10)))
      .toBe('user-1/1700000000000.jpg')
    vi.restoreAllMocks()
  })
})

describe('takePickedFile', () => {
  it('returns the first selected file and clears the input', () => {
    const file = makeFile('a.png', 'image/png', 10)
    const input = {
      files: [file],
      value: 'C:\\fakepath\\a.png',
    }
    const event = { target: input } as unknown as Event

    expect(takePickedFile(event)).toBe(file)
    expect(input.value).toBe('')
  })

  it('returns null when no file was selected', () => {
    const input = { files: null, value: '' }
    expect(takePickedFile({ target: input } as unknown as Event)).toBeNull()
  })
})
