<script setup lang="ts">
import AccountSwitcher from '~/components/home/AccountSwitcher.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { useAccount } from '~/composables/accounts/useAccount'

const { t } = useI18n()
const localePath = useLocalePath()
const { profile: me } = useUserProfile()
const { activeAccount, handleAvatarError } = useAccount()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const profileHref = computed(() => {
  const href = activeAccount.value?.href
  if (href) return localePath(href)
  const path = me.value?.profile?.profilePath
  return path ? localePath(path) : localePath('/settings/profile')
})

function close() {
  open.value = false
}

async function goToOwnProfile() {
  close()
  await navigateTo(profileHref.value)
}

function onDocumentClick(e: MouseEvent) {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div
    ref="rootRef"
    class="relative z-40"
  >
    <div
      class="flex h-10 items-center rounded-full transition ease-in-out"
      :class="{ 'bg-surface-hover-2': open }"
    >
      <button
        type="button"
        class="flex h-10 cursor-pointer items-center gap-2 rounded-full pl-1 pr-2 hover:bg-surface-hover"
        :aria-label="t('profiles.action.view_own_profile')"
        @click="goToOwnProfile"
      >
        <img
          v-if="activeAccount?.avatar && !activeAccount?.avatarLoadFailed"
          :src="activeAccount.avatar"
          class="size-8 shrink-0 rounded-full object-cover"
          @error="handleAvatarError(activeAccount.id)"
        />
        <div
          v-else
          class="flex size-8 shrink-0 items-center justify-center rounded-full"
          :style="{ backgroundImage: activeAccount?.avatarColor }"
        >
          <span class="text-xs font-semibold text-white">
            {{ activeAccount?.prefix }}
          </span>
        </div>
        <p class="text-[13px] font-semibold text-ink-2">
          {{ activeAccount?.name?.split(' ')[0] }}
        </p>
      </button>

      <button
        type="button"
        aria-haspopup="menu"
        :aria-expanded="open"
        class="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-surface-hover"
        :aria-label="t('social.account.signed_in_as')"
        @click.stop="open = !open"
      >
        <BaseIcon
          name="chevron"
          size="1.5em"
          class="text-ink-4 transition-transform"
          :class="{ 'rotate-180': open }"
        />
      </button>
    </div>

    <div
      v-show="open"
      class="absolute top-13 right-0 z-40"
    >
      <AccountSwitcher @close="close" />
    </div>
  </div>
</template>
