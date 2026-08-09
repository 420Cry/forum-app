import {
  buildAvatarObjectPath,
  validateAvatarFile,
} from '~/utils/avatarUpload'

const AVATAR_BUCKET = 'avatars'

export function useAvatarUpload() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const { t } = useI18n()

  async function uploadAvatar(file: File): Promise<string> {
    const validationKey = validateAvatarFile(file)
    if (validationKey) {
      throw createError({
        statusCode: 400,
        statusMessage: t(validationKey),
      })
    }

    const userId = user.value?.id
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: t('settings.error.avatar_auth'),
      })
    }

    const path = buildAvatarObjectPath(userId, file)
    const { error } = await client.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message || t('settings.error.avatar_upload'),
      })
    }

    const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  return { uploadAvatar }
}
