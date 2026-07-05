<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'

const { t } = useI18n()
const { logout } = useSupabaseAuth()

const handleLogout = async () => {
  await logout()
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <header
      class="h-14 flex items-center justify-between px-8 bg-card border-b border-line"
    >
      <span
        class="font-wordmark text-2xl font-bold tracking-tight text-ink select-none"
      >
        fund<span class="text-accent">e</span>dr
      </span>
      <div class="flex items-center gap-3">
        <LocaleSwitcher />
        <BaseButton
          intent="ghost"
          size="sm"
          @click="handleLogout"
        >
          {{ t('common.action.sign_out') }}
        </BaseButton>
      </div>
    </header>
    <slot />
  </div>
</template>
