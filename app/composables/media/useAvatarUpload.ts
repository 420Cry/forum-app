import {
  buildAvatarObjectPath,
  validateAvatarFile,
  validateAvatarMagicBytes,
} from '~/utils/avatarUpload'

const AVATAR_BUCKET = 'avatars'

export function useAvatarUpload() {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const { t } = useI18n()

  async function uploadAvatar(file: File): Promise<string> {
    const validationKey = validateAvatarFile(file)
      ?? await validateAvatarMagicBytes(file)
    if (validationKey) {
      throw createError({
        statusCode: 400,
        statusMessage: t(validationKey),
      })
    }

    const { data: sessionData } = await client.auth.getSession()
    const sessionUserId = sessionData.session?.user?.id ?? null
    const composableUserId = user.value?.id ?? null

    // useSupabaseUser() can lag behind a freshly established session (e.g. after
    // email confirm). Prefer composable id, fall back to getSession().
    const userId = composableUserId ?? sessionUserId
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
      const bucketMissing = /bucket not found/i.test(error.message)
      throw createError({
        statusCode: 400,
        statusMessage: bucketMissing
          ? t('settings.error.avatar_bucket')
          : (error.message || t('settings.error.avatar_upload')),
      })
    }

    const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  return { uploadAvatar }
}
