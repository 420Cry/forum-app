<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import FollowListRow from '~/components/profile/FollowListRow.vue'
import { useFollowsApi } from '~/composables/api/useFollowsApi'
import type { AccountType, AccountSummaryView } from '~/types/profile'
import { toAccountSummaryView } from '~/utils/accountSummary'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  title: string
  mode: 'followers' | 'following'
  /** Required when mode is followers. */
  targetType?: AccountType
  targetId?: string
  /** Required when mode is following. */
  userId?: string
  emptyMessage: string
  errorMessage: string
}>()

const emit = defineEmits<{
  'close': []
  'follow-change': [
    payload: {
      targetType: AccountType
      targetId: string
      following: boolean
    },
  ]
}>()

const { t } = useI18n()
const user = useSupabaseUser()
const { profile: me } = useUserProfile()
const { listFollowers, listFollowingForUser } = useFollowsApi()

const loading = ref(false)
const loadError = ref(false)
const items = ref<AccountSummaryView[]>([])

async function load() {
  loading.value = true
  loadError.value = false
  try {
    if (props.mode === 'followers') {
      if (!props.targetType || !props.targetId) {
        items.value = []
        return
      }
      const list = await listFollowers(props.targetType, props.targetId)
      items.value = list.map(toAccountSummaryView)
      return
    }
    if (!props.userId) {
      items.value = []
      return
    }
    const list = await listFollowingForUser(props.userId)
    items.value = list.map(toAccountSummaryView)
  }
  catch {
    items.value = []
    loadError.value = true
  }
  finally {
    loading.value = false
  }
}

watch(
  () =>
    [
      open.value,
      props.mode,
      props.targetType,
      props.targetId,
      props.userId,
    ] as const,
  ([isOpen]) => {
    if (isOpen) void load()
  },
)

onMounted(() => {
  if (open.value) void load()
})

function close() {
  open.value = false
  emit('close')
}

watch(open, (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})

function onRowFollowChange(
  item: AccountSummaryView,
  following: boolean,
) {
  emit('follow-change', {
    targetType: item.accountType,
    targetId: item.id,
    following,
  })
  if (following) return
  // Only prune when viewing your own following list (same as /following).
  if (props.mode !== 'following') return
  const meId = me.value?.id ?? user.value?.id
  if (!meId || props.userId !== meId) return
  items.value = items.value.filter(
    row => !(row.accountType === item.accountType && row.id === item.id),
  )
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-80 bg-ink/40"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out sm:transition-all sm:duration-200"
      leave-active-class="transition-transform duration-200 ease-in sm:transition-all sm:duration-150"
      enter-from-class="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
      leave-to-class="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
    >
      <div
        v-if="open"
        class="fixed inset-x-0 bottom-0 z-80 flex max-h-[90vh] flex-col rounded-t-2xl bg-card shadow-pop sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:max-h-[min(80vh,640px)] sm:-translate-1/2  sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div
          class="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-ink-5 sm:hidden"
          aria-hidden="true"
        />

        <header class="relative flex flex-none items-center gap-3 border-b border-line px-4 py-3 sm:px-5 sm:py-3.5">
          <h2 class="min-w-0 flex-1 text-center text-[15px] font-semibold text-ink sm:px-0 sm:text-left ">
            {{ title }}
          </h2>
          <button
            type="button"
            class="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 flex-none items-center justify-center rounded-pill text-ink-3 hover:bg-surface-hover cursor-pointer"
            :aria-label="t('common.aria.dismiss')"
            @click="close"
          >
            <BaseIcon
              name="close"
              size="1.25em"
            />
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-1 sm:px-5">
          <p
            v-if="loading"
            class="px-1 py-8 text-center text-sm text-ink-3"
          >
            {{ t('common.info.loading') }}
          </p>
          <p
            v-else-if="loadError"
            class="px-1 py-8 text-center text-sm text-ink-3"
          >
            {{ errorMessage }}
          </p>
          <p
            v-else-if="items.length === 0"
            class="px-1 py-8 text-center text-sm text-ink-3"
          >
            {{ emptyMessage }}
          </p>
          <template v-else>
            <FollowListRow
              v-for="item in items"
              :key="`${item.accountType}-${item.id}`"
              :item="item"
              @navigate="close"
              @follow-change="onRowFollowChange(item, $event)"
            />
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
