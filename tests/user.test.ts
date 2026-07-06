import { describe, expect, it } from 'vitest'
import {
  isOnboardingComplete,
  postAuthPath,
  type UserProfile,
} from '~/types/user'

const incompleteProfile: UserProfile = {
  onboarded: false,
  role: 'Founder',
  name: null,
  occupation: null,
  age: null,
  location: null,
  goals: [],
}

const completeProfile: UserProfile = {
  onboarded: true,
  role: 'Investor',
  name: 'Dao Nguyen',
  occupation: 'Angel',
  age: 30,
  location: 'Hanoi',
  goals: ['discover_startups'],
}

describe('user profile helpers', () => {
  describe('isOnboardingComplete', () => {
    it('returns false for missing or incomplete profiles', () => {
      expect(isOnboardingComplete(null)).toBe(false)
      expect(isOnboardingComplete(undefined)).toBe(false)
      expect(isOnboardingComplete(incompleteProfile)).toBe(false)
    })

    it('returns true when onboarded flag is set', () => {
      expect(isOnboardingComplete(completeProfile)).toBe(true)
    })
  })

  describe('postAuthPath', () => {
    it('routes incomplete users to onboarding', () => {
      expect(postAuthPath(null)).toBe('/onboard')
      expect(postAuthPath(incompleteProfile)).toBe('/onboard')
    })

    it('routes onboarded users to home', () => {
      expect(postAuthPath(completeProfile)).toBe('/home')
    })
  })
})
