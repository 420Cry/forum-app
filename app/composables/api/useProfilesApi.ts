import type {
  AccountSummary,
  FindResults,
  InvestorProfile,
  InvestorProfilePayload,
  PublicUserProfile,
  StartupProfile,
  StartupProfilePayload,
} from '~/types/profile'
import { useApiFetch } from './useApiFetch'

export function useProfilesApi() {
  const { apiFetch } = useApiFetch()

  async function listAccounts() {
    return apiFetch<AccountSummary[]>('/me/accounts')
  }

  async function createStartup(payload: StartupProfilePayload) {
    return apiFetch<StartupProfile>('/profiles/startup', {
      method: 'POST',
      body: payload,
    })
  }

  async function updateStartup(payload: Partial<StartupProfilePayload>) {
    return apiFetch<StartupProfile>('/profiles/startup', {
      method: 'PATCH',
      body: payload,
    })
  }

  async function getStartup(id: string) {
    return apiFetch<StartupProfile>(
      `/profiles/startup/${encodeURIComponent(id)}`,
      { requireAuth: false },
    )
  }

  async function recordStartupView(id: string) {
    return apiFetch<{ views: number }>(
      `/profiles/startup/${encodeURIComponent(id)}/view`,
      { method: 'POST' },
    )
  }

  async function createInvestor(payload: InvestorProfilePayload) {
    return apiFetch<InvestorProfile>('/profiles/investor', {
      method: 'POST',
      body: payload,
    })
  }

  async function updateInvestor(payload: Partial<InvestorProfilePayload>) {
    return apiFetch<InvestorProfile>('/profiles/investor', {
      method: 'PATCH',
      body: payload,
    })
  }

  async function getInvestor(id: string) {
    return apiFetch<InvestorProfile>(
      `/profiles/investor/${encodeURIComponent(id)}`,
      { requireAuth: false },
    )
  }

  async function recordInvestorView(id: string) {
    return apiFetch<{ views: number }>(
      `/profiles/investor/${encodeURIComponent(id)}/view`,
      { method: 'POST' },
    )
  }

  async function getPublicUser(urlKeyOrId: string) {
    return apiFetch<PublicUserProfile>(
      `/profiles/user/${encodeURIComponent(urlKeyOrId)}`,
      { requireAuth: false },
    )
  }

  async function find(params: Record<string, string | undefined>) {
    const query = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value != null && value !== ''),
    )
    return apiFetch<FindResults>('/find', { query })
  }

  return {
    listAccounts,
    createStartup,
    updateStartup,
    getStartup,
    recordStartupView,
    createInvestor,
    updateInvestor,
    getInvestor,
    recordInvestorView,
    getPublicUser,
    find,
  }
}
