import { describe, expect, it } from 'vitest'
import {
  DATE_OF_BIRTH_RE,
  dateOfBirthFieldError,
  isValidAdultDateOfBirth,
  minDateOfBirthInput,
} from '../app/utils/dateOfBirth'

const t = (key: string) => key

describe('dateOfBirthFieldError', () => {
  it('requires a value', () => {
    expect(dateOfBirthFieldError('', t)).toBe('onboard.error.dob_required')
  })

  it('rejects malformed dates', () => {
    expect(dateOfBirthFieldError('1996-13-01', t)).toBe(
      'onboard.error.dob_invalid',
    )
    expect(dateOfBirthFieldError('1996-02-30', t)).toBe(
      'onboard.error.dob_invalid',
    )
    expect(dateOfBirthFieldError('not-a-date', t)).toBe(
      'onboard.error.dob_invalid',
    )
  })

  it('rejects future dates before underage message', () => {
    expect(dateOfBirthFieldError('2027-01-15', t)).toBe(
      'onboard.error.dob_future',
    )
  })

  it('rejects too young and too old ages', () => {
    expect(dateOfBirthFieldError('2015-01-01', t)).toBe(
      'onboard.error.dob_too_young',
    )

    const tooOldYear = Number(minDateOfBirthInput().slice(0, 4)) - 1
    expect(dateOfBirthFieldError(`${tooOldYear}-01-01`, t)).toBe(
      'onboard.error.dob_too_old',
    )
  })

  it('accepts a valid adult date', () => {
    expect(dateOfBirthFieldError('1996-01-15', t)).toBeNull()
    expect(isValidAdultDateOfBirth('1996-01-15')).toBe(true)
    expect(DATE_OF_BIRTH_RE.test('1996-01-15')).toBe(true)
  })
})
