/** Clamp a public counter after an optimistic follow/unfollow delta. */
export function adjustFollowCount(
  current: number | null | undefined,
  following: boolean,
): number {
  return Math.max(0, (current ?? 0) + (following ? 1 : -1))
}
