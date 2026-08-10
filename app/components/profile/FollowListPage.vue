<script setup lang="ts">
import ResultCard from '~/components/directory/ResultCard.vue'
import type { AccountType } from '~/types/profile'
import { stageToPillVariant } from '~/utils/stagePill'
import type { toAccountSummaryView } from '~/utils/accountSummary'

defineProps<{
  title: string
  subtitle?: string
  loading: boolean
  loadError: boolean
  emptyMessage: string
  errorMessage: string
  items: ReturnType<typeof toAccountSummaryView>[]
}>()

const emit = defineEmits<{
  'follow-change': [
    payload: { targetType: AccountType, targetId: string, following: boolean },
  ]
}>()

const { t } = useI18n()

function pillFor(account: ReturnType<typeof toAccountSummaryView>) {
  if (account.accountType === 'investor') {
    return { variant: 'investor' as const, label: t('find.type.investor') }
  }
  if (account.accountType === 'startup') {
    const stageGuess = account.headline?.split(/[·/]/).pop()?.trim()
    const variant = stageToPillVariant(stageGuess)
    return {
      variant,
      label: variant ? t(`profiles.stage.${variant}`) : undefined,
    }
  }
  return { variant: undefined, label: undefined }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="bg-card border border-line rounded-md shadow-1 px-5 py-4">
      <h1 class="text-[15px] font-semibold text-ink">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="text-[12.5px] text-ink-4 mt-0.5"
      >
        {{ subtitle }}
      </p>
    </div>

    <p
      v-if="loading"
      class="text-sm text-ink-3 px-1"
    >
      {{ t('common.info.loading') }}
    </p>
    <div
      v-else-if="loadError"
      class="bg-card border border-line rounded-md shadow-1 px-5 py-8 text-center text-sm text-ink-3"
    >
      {{ errorMessage }}
    </div>
    <div
      v-else-if="items.length === 0"
      class="bg-card border border-line rounded-md shadow-1 px-5 py-8 text-center text-sm text-ink-3"
    >
      {{ emptyMessage }}
    </div>
    <ResultCard
      v-for="item in items"
      :key="`${item.accountType}-${item.id}`"
      :name="item.name"
      :href="item.href"
      :target-type="item.accountType"
      :target-id="item.id"
      :industry="item.subtitle || t(`find.type.${item.accountType}`)"
      :meta="[item.location].filter(Boolean) as string[]"
      :pill-variant="pillFor(item).variant"
      :pill-label="pillFor(item).label"
      :avatar-url="item.avatar || null"
      @follow-change="emit('follow-change', $event)"
    />
  </div>
</template>
