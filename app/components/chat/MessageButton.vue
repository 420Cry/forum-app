<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import { useChatApi } from '~/composables/api/useChatApi'
import {
  AUTH_REDIRECT_QUERY,
  authReturnPathFromRoute,
} from '~/utils/authRedirect'

const props = withDefaults(
  defineProps<{
    /** Person to message (Supabase UID). */
    userId: string
    /** Hide when the viewer is this person. */
    isOwn?: boolean
  }>(),
  { isOwn: false },
)

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const toast = useToast()
const user = useSupabaseUser()
const session = useSupabaseSession()
const { profile: me, unauthorized } = useUserProfile()
const { openChannel } = useChatApi()

const busy = ref(false)
const isSignedIn = computed(
  () =>
    !unauthorized.value
    && !!(user.value?.id || me.value?.id || session.value?.access_token),
)

function goSignIn() {
  const redirect = authReturnPathFromRoute(route.fullPath)
  void navigateTo({
    path: localePath('/auth/login'),
    query: redirect ? { [AUTH_REDIRECT_QUERY]: redirect } : undefined,
  })
}

async function startChat() {
  if (busy.value) return
  busy.value = true
  try {
    const { channelUrl } = await openChannel(props.userId)
    await navigateTo({
      path: localePath('/messages'),
      query: { channelUrl },
    })
  }
  catch (err) {
    const code = Number((err as { statusCode?: number }).statusCode ?? 0)
    toast.showError(
      code === 503
        ? t('chat.info.unavailable')
        : t('chat.error.open'),
      3000,
    )
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <BaseButton
    v-if="!isOwn && !isSignedIn"
    intent="primary"
    size="sm"
    @click="goSignIn"
  >
    {{ t('chat.action.sign_in_to_message') }}
  </BaseButton>
  <BaseButton
    v-else-if="!isOwn"
    intent="primary"
    size="sm"
    :disabled="busy"
    @click="startChat"
  >
    {{ t('chat.action.message') }}
  </BaseButton>
</template>
