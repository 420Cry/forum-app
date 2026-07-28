<script setup lang="ts">
import type { AccountSummaryView } from '~/types/profile'
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'

const props = defineProps<{
  account?: AccountSummaryView
}>()

const emit = defineEmits<{
  openComposer: []
  avatarError: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <!-- Startup / investor pages: upsell when unpaid, composer once subscribed -->
  <div
    v-if="props.account"
    class="rounded-md border border-line bg-card px-4 pb-2.5 pt-3.5 shadow-1"
  >
    <div class="flex items-center gap-3">
      <AccountAvatar
        :account="props.account"
        :handle-avatar-error="id => emit('avatarError', id)"
        size="size-11"
      />
      <button
        type="button"
        class="h-11 flex-1 rounded-pill border border-line bg-surface-hover px-[18px] text-left text-sm text-ink-4 transition-colors hover:border-line-2 hover:bg-surface-hover-2"
        @click="emit('openComposer')"
      >
        {{ t('feed.composer.placeholder', { name: props.account.name }) }}
      </button>
    </div>

    <div
      class="mt-2.5 flex items-center justify-between border-t border-line pt-2.5"
    >
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-semibold text-ink-2 hover:bg-surface-hover"
          @click="emit('openComposer')"
        >
          <BaseIcon
            name="camera"
            size="18px"
            class="text-[#4E9A66]"
          />
          <span>{{ t('feed.composer.photo') }}</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-semibold text-ink-2 hover:bg-surface-hover"
          @click="emit('openComposer')"
        >
          <BaseIcon
            name="milestone"
            size="18px"
            class="text-[#C97A3A]"
          />
          <span>{{ t('feed.composer.milestone') }}</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-sm px-3 py-2 text-[13px] font-semibold text-ink-2 hover:bg-surface-hover"
          @click="emit('openComposer')"
        >
          <BaseIcon
            name="opportunity"
            size="18px"
            class="text-brand"
          />
          <span>{{ t('feed.composer.opportunity') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
