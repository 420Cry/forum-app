/** Resolve signed-in viewer id; useSupabaseUser() can lag on public routes. */
export async function resolveViewerId(
  composableUserId: string | null | undefined,
  meId: string | null | undefined,
): Promise<string | null> {
  if (composableUserId) return composableUserId
  const client = useSupabaseClient()
  const { data } = await client.auth.getSession()
  return data.session?.user?.id ?? meId ?? null
}
