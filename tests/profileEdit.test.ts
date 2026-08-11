import { describe, expect, it } from 'vitest'
import { buildSettingsProfileUpdate } from '~/utils/profileEdit'

const base = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  dateOfBirth: '1996-01-15',
  location: 'london',
  occupation: 'engineer',
  urlKey: 'ada-lovelace',
  avatarUrl: null as string | null,
  committedAvatarUrl: null as string | null | undefined,
}

describe('buildSettingsProfileUpdate', () => {
  it('builds field payload without avatar when draft matches committed', () => {
    expect(
      buildSettingsProfileUpdate({
        ...base,
        avatarUrl: 'https://cdn.example.com/a.png',
        committedAvatarUrl: 'https://cdn.example.com/a.png',
      }),
    ).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1996-01-15',
      location: 'london',
      occupation: 'engineer',
      urlKey: 'ada-lovelace',
    })
  })

  it('includes avatarUrl only when the draft differs from committed', () => {
    expect(
      buildSettingsProfileUpdate({
        ...base,
        avatarUrl: 'https://cdn.example.com/new.png',
        committedAvatarUrl: 'https://cdn.example.com/old.png',
      }),
    ).toMatchObject({
      avatarUrl: 'https://cdn.example.com/new.png',
    })
  })

  it('treats missing committed avatar as null for comparison', () => {
    expect(
      buildSettingsProfileUpdate({
        ...base,
        avatarUrl: 'https://cdn.example.com/new.png',
        committedAvatarUrl: undefined,
      }).avatarUrl,
    ).toBe('https://cdn.example.com/new.png')
  })

  it('includes optional location and occupation display names when set', () => {
    expect(
      buildSettingsProfileUpdate({
        ...base,
        locationName: '  London, UK  ',
        occupationName: 'Engineer',
      }),
    ).toMatchObject({
      locationName: 'London, UK',
      occupationName: 'Engineer',
    })
  })

  it('omits blank optional display names', () => {
    const payload = buildSettingsProfileUpdate({
      ...base,
      locationName: '   ',
      occupationName: '',
    })
    expect(payload).not.toHaveProperty('locationName')
    expect(payload).not.toHaveProperty('occupationName')
  })
})
