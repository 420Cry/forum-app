<script setup lang="ts">
import FollowListPage from '~/components/profile/FollowListPage.vue'
import { useFollowListPage } from '~/composables/social/useFollowListPage'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const route = useRoute()
const targetId = computed(() => String(route.params.id ?? ''))

const { loading, loadError, items, onFollowChange } = useFollowListPage({
  mode: 'followers',
  targetType: 'startup',
  targetId,
})
</script>

<template>
  <FollowListPage
    :title="t('profiles.heading.followers')"
    :subtitle="t('profiles.info.followers_subtitle')"
    :loading="loading"
    :load-error="loadError"
    :empty-message="t('profiles.info.followers_empty')"
    :error-message="t('profiles.info.followers_error')"
    :items="items"
    @follow-change="onFollowChange"
  />
</template>
