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

/** Magic-byte check — do not trust `file.type` alone. */
export async function validateAvatarMagicBytes(
  file: File,
): Promise<string | null> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (isJpeg(header) || isPng(header) || isWebp(header)) return null
  return 'settings.error.avatar_type'
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3
    && bytes[0] === 0xff
    && bytes[1] === 0xd8
    && bytes[2] === 0xff
}

function isPng(bytes: Uint8Array): boolean {
  return bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
}

function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false
  const riff = String.fromCharCode(bytes[0]!, bytes[1]!, bytes[2]!, bytes[3]!)
  const webp = String.fromCharCode(bytes[8]!, bytes[9]!, bytes[10]!, bytes[11]!)
  return riff === 'RIFF' && webp === 'WEBP'
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
