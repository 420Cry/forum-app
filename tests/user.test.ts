import { describe, expect, it } from 'vitest'
import {
  inferOnboardingStep,
  isOnboardingComplete,
  postAuthPath,
  type UserProfile,
} from '~/types/user'

const incompleteProfile: UserProfile = {
  onboarded: false,
  onboardingStep: null,
  role: 'Founder',
  name: null,
  occupation: null,
  age: null,
  location: null,
  goals: [],
}

const completeProfile: UserProfile = {
  onboarded: true,
  onboardingStep: null,
  role: 'Investor',
  name: 'Alex Morgan',
  occupation: 'Angel',
  age: 30,
  location: 'Austin',
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
      expect(postAuthPath(completeProfile)).toBe('/social')
    })
  })

  describe('inferOnboardingStep', () => {
    it('uses saved onboardingStep when present', () => {
      expect(
        inferOnboardingStep({ ...incompleteProfile, onboardingStep: 2 }),
      ).toBe(2)
    })

    it('infers step from profile fields when step is missing', () => {
      expect(inferOnboardingStep(incompleteProfile)).toBe(2)
      expect(
        inferOnboardingStep({ ...incompleteProfile, goals: ['raise_capital'] }),
      ).toBe(3)
      expect(inferOnboardingStep(null)).toBe(1)
    })
  })
})
