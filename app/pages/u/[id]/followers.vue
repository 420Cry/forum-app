<script setup lang="ts">
import FollowListPage from '~/components/profile/FollowListPage.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import { useFollowListPage } from '~/composables/social/useFollowListPage'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const route = useRoute()
const { getPublicUser } = useProfilesApi()

const routeKey = computed(() => String(route.params.id ?? ''))
const userId = ref('')
const resolveError = ref(false)

onMounted(async () => {
  try {
    const profile = await getPublicUser(routeKey.value)
    userId.value = profile.id
  }
  catch {
    resolveError.value = true
  }
})

const { loading, loadError, items, onFollowChange } = useFollowListPage({
  mode: 'followers',
  targetType: 'user',
  targetId: userId,
})
</script>

<template>
  <FollowListPage
    :title="t('profiles.heading.followers')"
    :subtitle="t('profiles.info.followers_subtitle')"
    :loading="!resolveError && (loading || !userId)"
    :load-error="resolveError || loadError"
    :empty-message="t('profiles.info.followers_empty')"
    :error-message="t('profiles.info.followers_error')"
    :items="items"
    @follow-change="onFollowChange"
  />
</template>
