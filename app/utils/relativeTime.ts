/**
 * Format an ISO timestamp into a short relative label for feed cards
 * (e.g. "2h", "3d"). Falls back to a minimum of "1m" for very recent items.
 */
export const formatRelativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${Math.max(mins, 1)}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
