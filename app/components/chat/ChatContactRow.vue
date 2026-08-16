<script setup lang="ts">
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import type { UserConnection } from '~/types/profile'
import { accountNamePrefix } from '~/utils/accountSummary'
import { getAvatarColor } from '~/utils/avatarColor'

const props = defineProps<{
  contact: UserConnection
}>()

const { t } = useI18n()

const account = computed(() => ({
  id: props.contact.id,
  avatar: props.contact.avatarUrl ?? '',
  avatarLoadFailed: false,
  avatarColor: getAvatarColor(props.contact.id),
  prefix: accountNamePrefix(props.contact.name || '?'),
}))

const relationLabel = computed(() => {
  if (props.contact.relation === 'mutual') {
    return t('chat.label.relation_mutual')
  }
  if (props.contact.relation === 'follower') {
    return t('chat.label.relation_follower')
  }
  return t('chat.label.relation_following')
})

const relationClass = computed(() => {
  if (props.contact.relation === 'mutual') {
    return 'bg-brand-tint text-brand'
  }
  return 'bg-surface-hover text-ink-3'
})

function onAvatarError() {
  // AccountAvatar handles fallback via load-failed path.
}
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 px-4 py-3 text-left rounded-none md:rounded-md md:px-3 md:py-2.5 transition-colors cursor-pointer border-0 bg-transparent hover:bg-surface-hover active:bg-surface-hover"
    data-testid="messages-contact-row"
  >
    <AccountAvatar
      :account="account"
      size="size-10"
      text-class="text-sm"
      :handle-avatar-error="onAvatarError"
    />
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="text-[13.5px] font-semibold text-ink truncate min-w-0">
          {{ contact.name }}
        </span>
        <span
          class="shrink-0 rounded-pill px-1.5 py-0.5 text-[10px] font-semibold tracking-wide"
          :class="relationClass"
        >
          {{ relationLabel }}
        </span>
      </div>
      <p
        v-if="contact.headline"
        class="text-[12.5px] text-ink-3 truncate mt-0.5"
      >
        {{ contact.headline }}
      </p>
    </div>
  </button>
</template>
