const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return 'settings.error.avatar_type'
  }
  if (file.size > MAX_BYTES) {
    return 'settings.error.avatar_size'
  }
  return null
}

export function buildAvatarObjectPath(userId: string, file: File): string {
  const ext
    = file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
        ? 'webp'
        : 'jpg'
  return `${userId}/${Date.now()}.${ext}`
}

/** Reads the first file from a file input change, then clears the input. */
export function takePickedFile(event: Event): File | null {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  input.value = ''
  return file
}
