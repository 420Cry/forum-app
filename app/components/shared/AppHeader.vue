<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'

const { showSignOut = false } = defineProps<{
  showSignOut?: boolean
}>()

const { t } = useI18n()
const { logout } = useSupabaseAuth()

async function handleLogout() {
  await logout()
  await navigateTo('/')
}
</script>

<template>
  <header
    class="h-14 flex items-center justify-between px-8 bg-card border-b border-line"
  >
    <SharedAppLogo />
    <div class="flex items-center gap-3">
      <LocaleSwitcher />
      <BaseButton
        v-if="showSignOut"
        intent="ghost"
        size="sm"
        @click="handleLogout"
      >
        {{ t('common.action.sign_out') }}
      </BaseButton>
    </div>
  </header>
</template>
