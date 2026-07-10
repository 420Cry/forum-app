<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import LocaleSwitcher from '~/components/shared/LocaleSwitcher.vue'

const { showSignOut = false, constrained = false } = defineProps<{
  showSignOut?: boolean
  /** Match auth layout content width (max-w-3xl). */
  constrained?: boolean
}>()

const { t } = useI18n()
const { logout } = useSupabaseAuth()
const localePath = useLocalePath()

async function handleLogout() {
  await logout()
  await navigateTo(localePath('/'), { replace: true })
}
</script>

<template>
  <header class="border-b border-line bg-card">
    <div
      class="mx-auto grid h-14 w-full grid-cols-[1fr_auto] items-center gap-6 px-7"
      :class="constrained ? 'max-w-3xl' : 'max-w-5xl'"
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
    </div>
  </header>
</template>
