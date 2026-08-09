<script setup lang="ts">
import ResultCard from '~/components/directory/ResultCard.vue'
import { useFollowsApi } from '~/composables/api/useFollowsApi'
import type { AccountSummary } from '~/types/profile'
import { toAccountSummaryView } from '~/utils/accountSummary'
import { stageToPillVariant } from '~/utils/stagePill'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const { listFollowing } = useFollowsApi()

const loading = ref(true)
const items = ref<ReturnType<typeof toAccountSummaryView>[]>([])

function hrefFor(account: AccountSummary) {
  if (account.accountType === 'startup') return `/startup/${account.id}`
  if (account.accountType === 'investor') return `/investor/${account.id}`
  return `/u/${account.id}`
}

function pillFor(account: AccountSummary) {
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

onMounted(async () => {
  try {
    const list = await listFollowing()
    items.value = list.map(toAccountSummaryView)
  }
  catch {
    items.value = []
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="bg-card border border-line rounded-md shadow-1 px-5 py-4">
      <h1 class="text-[15px] font-semibold text-ink">
        {{ t('following.heading.title') }}
      </h1>
      <p class="text-[12.5px] text-ink-4 mt-0.5">
        {{ t('following.info.subtitle') }}
      </p>
    </div>

    <p
      v-if="loading"
      class="text-sm text-ink-3 px-1"
    >
      {{ t('common.info.loading') }}
    </p>
    <div
      v-else-if="items.length === 0"
      class="bg-card border border-line rounded-md shadow-1 px-5 py-8 text-center text-sm text-ink-3"
    >
      {{ t('following.info.empty') }}
    </div>
    <ResultCard
      v-for="item in items"
      :key="`${item.accountType}-${item.id}`"
      :name="item.name"
      :href="hrefFor(item)"
      :target-type="item.accountType"
      :target-id="item.id"
      :industry="item.subtitle || t(`find.type.${item.accountType}`)"
      :meta="[item.location].filter(Boolean) as string[]"
      :pill-variant="pillFor(item).variant"
      :pill-label="pillFor(item).label"
      :avatar-url="item.avatar || null"
    />
  </div>
</template>
