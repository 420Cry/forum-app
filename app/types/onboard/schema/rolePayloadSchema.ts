import * as z from 'zod'
import { roleTitles } from '~/types/onboard/onboardType'

export function createRolePayloadSchema(t: (key: string) => string) {
  return z.object({
    role: z.enum(roleTitles, t('onboard.error.role_invalid')),
  })
}

export type RolePayload = z.infer<ReturnType<typeof createRolePayloadSchema>>
