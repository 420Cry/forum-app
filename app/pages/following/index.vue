<script setup lang="ts">
import { useFollowsApi } from '~/composables/api/useFollowsApi'
import type { AccountSummary } from '~/types/profile'
import { toAccountSummaryView } from '~/utils/accountSummary'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const localePath = useLocalePath()
const { listFollowing } = useFollowsApi()

const loading = ref(true)
const items = ref<ReturnType<typeof toAccountSummaryView>[]>([])

function hrefFor(account: AccountSummary) {
  if (account.accountType === 'startup') return `/startup/${account.id}`
  if (account.accountType === 'investor') return `/investor/${account.id}`
  return `/u/${account.id}`
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
  <div class="mx-auto w-full max-w-5xl px-7 py-6">
    <h1 class="text-xl font-semibold text-ink mb-1">
      {{ t('following.heading.title') }}
    </h1>
    <p class="text-sm text-ink-3 mb-6">
      {{ t('following.info.subtitle') }}
    </p>

    <p
      v-if="loading"
      class="text-sm text-ink-3"
    >
      {{ t('common.info.loading') }}
    </p>
    <p
      v-else-if="items.length === 0"
      class="text-sm text-ink-3"
    >
      {{ t('following.info.empty') }}
    </p>
    <div
      v-else
      class="flex flex-col gap-2"
    >
      <NuxtLink
        v-for="item in items"
        :key="`${item.accountType}-${item.id}`"
        :to="localePath(hrefFor(item))"
        class="flex items-center gap-3 bg-card border border-line rounded-md px-4 py-3 hover:bg-surface-hover no-underline"
      >
        <img
          v-if="item.avatar && !item.avatarLoadFailed"
          :src="item.avatar"
          class="size-10 rounded-full object-cover shrink-0"
          @error="item.avatarLoadFailed = true"
        />
        <div
          v-else
          class="size-10 rounded-full flex justify-center items-center shrink-0"
          :style="{ backgroundImage: item.avatarColor }"
        >
          <span class="font-semibold text-sm text-white">
            {{ item.prefix }}
          </span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-[14px] text-ink truncate">
            {{ item.name }}
          </p>
          <p class="text-sm text-ink-3 truncate">
            {{ item.subtitle || t(`find.type.${item.accountType}`) }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
