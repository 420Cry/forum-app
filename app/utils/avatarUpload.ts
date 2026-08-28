const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export type AvatarKind = 'jpeg' | 'png' | 'webp'

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
export async function detectAvatarKind(file: File): Promise<AvatarKind | null> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (isJpeg(header)) return 'jpeg'
  if (isPng(header)) return 'png'
  if (isWebp(header)) return 'webp'
  return null
}

export async function validateAvatarMagicBytes(
  file: File,
): Promise<string | null> {
  return (await detectAvatarKind(file)) ? null : 'settings.error.avatar_type'
}

export function avatarContentType(kind: AvatarKind): string {
  if (kind === 'png') return 'image/png'
  if (kind === 'webp') return 'image/webp'
  return 'image/jpeg'
}

export function buildAvatarObjectPath(userId: string, kind: AvatarKind): string {
  const ext = kind === 'png' ? 'png' : kind === 'webp' ? 'webp' : 'jpg'
  return `${userId}/${Date.now()}.${ext}`
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

/** Reads the first file from a file input change, then clears the input. */
export function takePickedFile(event: Event): File | null {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  input.value = ''
  return file
}
