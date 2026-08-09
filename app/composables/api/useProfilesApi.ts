import type {
  AccountSummary,
  FindResults,
  InvestorProfile,
  InvestorProfilePayload,
  PublicUserProfile,
  StartupProfile,
  StartupProfilePayload,
} from '~/types/profile'
import { useApiConfig } from './useApiConfig'

export function useProfilesApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function listAccounts() {
    const headers = await getAuthHeaders()
    return $fetch<AccountSummary[]>(`${baseUrl}/me/accounts`, { headers })
  }

  async function createStartup(payload: StartupProfilePayload) {
    const headers = await getAuthHeaders()
    return $fetch<StartupProfile>(`${baseUrl}/profiles/startup`, {
      method: 'POST',
      headers,
      body: payload,
    })
  }

  async function updateStartup(payload: Partial<StartupProfilePayload>) {
    const headers = await getAuthHeaders()
    return $fetch<StartupProfile>(`${baseUrl}/profiles/startup`, {
      method: 'PATCH',
      headers,
      body: payload,
    })
  }

  async function getStartup(id: string) {
    return $fetch<StartupProfile>(`${baseUrl}/profiles/startup/${id}`)
  }

  async function createInvestor(payload: InvestorProfilePayload) {
    const headers = await getAuthHeaders()
    return $fetch<InvestorProfile>(`${baseUrl}/profiles/investor`, {
      method: 'POST',
      headers,
      body: payload,
    })
  }

  async function updateInvestor(payload: Partial<InvestorProfilePayload>) {
    const headers = await getAuthHeaders()
    return $fetch<InvestorProfile>(`${baseUrl}/profiles/investor`, {
      method: 'PATCH',
      headers,
      body: payload,
    })
  }

  async function getInvestor(id: string) {
    return $fetch<InvestorProfile>(`${baseUrl}/profiles/investor/${id}`)
  }

  async function getPublicUser(id: string) {
    return $fetch<PublicUserProfile>(`${baseUrl}/profiles/user/${id}`)
  }

  async function find(params: Record<string, string | undefined>) {
    const headers = await getAuthHeaders()
    const query = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value != null && value !== ''),
    )
    return $fetch<FindResults>(`${baseUrl}/find`, { headers, query })
  }

  return {
    listAccounts,
    createStartup,
    updateStartup,
    getStartup,
    createInvestor,
    updateInvestor,
    getInvestor,
    getPublicUser,
    find,
  }
}
