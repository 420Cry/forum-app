<script setup lang="ts">
import ChatChannelRow from '~/components/chat/ChatChannelRow.vue'
import ChatContactRow from '~/components/chat/ChatContactRow.vue'
import ChatEmptyState from '~/components/chat/ChatEmptyState.vue'
import ChatThread from '~/components/chat/ChatThread.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { useChatApi } from '~/composables/api/useChatApi'
import { useFollowsApi } from '~/composables/api/useFollowsApi'
import { useSendbirdInbox } from '~/composables/chat/useSendbirdInbox'
import { useUnreadCount } from '~/composables/chat/useUnreadCount'
import type { UserConnection } from '~/types/profile'
import { foldSearchText } from '~/utils/foldSearchText'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const { openChannel } = useChatApi()
const { listConnections } = useFollowsApi()
const { refresh: refreshUnread } = useUnreadCount()

const {
  status,
  myUserId,
  channels,
  selectedUrl,
  selected,
  messages,
  sending,
  threadError,
  connect,
  refreshChannels,
  openThread,
  send,
  clearThread,
  deliveryStatusFor,
  toggleReaction,
  receiptEpoch,
} = useSendbirdInbox()

/** Split list + thread from md up (tablet / desktop). Phone stays single-pane. */
const isSplit = ref(false)
const search = ref('')
const contacts = ref<UserConnection[]>([])
const contactsLoading = ref(false)
const contactsError = ref(false)
let contactsLoaded = false

function syncBreakpoint() {
  isSplit.value = window.matchMedia('(min-width: 768px)').matches
}

const showList = computed(() => isSplit.value || !selectedUrl.value)
const showThread = computed(() => isSplit.value || !!selectedUrl.value)
const searchActive = computed(() => search.value.trim().length > 0)

const filteredContacts = computed(() => {
  const q = foldSearchText(search.value.trim())
  if (!q) return contacts.value
  return contacts.value.filter((contact) => {
    const name = foldSearchText(contact.name)
    const key = foldSearchText(contact.urlKey ?? '')
    const headline = foldSearchText(contact.headline ?? '')
    return name.includes(q) || key.includes(q) || headline.includes(q)
  })
})

/** Suggested people when there are no chats yet (mutuals first). */
const suggestedContacts = computed(() => {
  const list = contacts.value
  const mutual = list.filter(c => c.relation === 'mutual')
  const rest = list.filter(c => c.relation !== 'mutual')
  return [...mutual, ...rest].slice(0, 12)
})

async function ensureContacts() {
  if (contactsLoaded || contactsLoading.value) return
  contactsLoading.value = true
  contactsError.value = false
  try {
    contacts.value = await listConnections()
    contactsLoaded = true
  }
  catch {
    contactsError.value = true
  }
  finally {
    contactsLoading.value = false
  }
}

async function selectChannel(url: string) {
  search.value = ''
  await openThread(url)
  await navigateTo({
    path: localePath('/messages'),
    query: { channelUrl: url },
    replace: true,
  })
  void refreshUnread()
}

async function startWithContact(userId: string) {
  try {
    const opened = await openChannel(userId)
    search.value = ''
    await refreshChannels()
    await navigateTo({
      path: localePath('/messages'),
      query: { channelUrl: opened.channelUrl },
      replace: true,
    })
    await openThread(opened.channelUrl)
    void refreshUnread()
  }
  catch {
    toast.showError(t('chat.error.open'), 3000)
  }
}

async function onSend(text: string) {
  try {
    await send(text)
    void refreshUnread()
  }
  catch {
    toast.showError(t('chat.error.send'), 3000)
  }
}

async function onReact(message: Parameters<typeof toggleReaction>[0], emoji: string) {
  try {
    await toggleReaction(message, emoji)
  }
  catch {
    toast.showError(t('chat.error.reaction'), 3000)
  }
}

function onBack() {
  clearThread()
  void navigateTo({ path: localePath('/messages'), replace: true })
}

async function openFirstChannelIfNeeded() {
  if (!isSplit.value) return
  if (String(route.query.channelUrl ?? '').trim()) return
  if (String(route.query.userId ?? '').trim()) return
  if (selectedUrl.value) return
  const first = channels.value[0]
  if (first) await selectChannel(first.url)
}

async function applyQuery() {
  const channelUrl = String(route.query.channelUrl ?? '').trim()
  const userId = String(route.query.userId ?? '').trim()

  if (channelUrl) {
    await openThread(channelUrl)
    return
  }

  if (userId) {
    try {
      const opened = await openChannel(userId)
      await refreshChannels()
      await navigateTo({
        path: localePath('/messages'),
        query: { channelUrl: opened.channelUrl },
        replace: true,
      })
      await openThread(opened.channelUrl)
    }
    catch {
      toast.showError(t('chat.error.open'), 3000)
    }
    return
  }

  await openFirstChannelIfNeeded()
}

onMounted(async () => {
  syncBreakpoint()
  window.addEventListener('resize', syncBreakpoint)
  await connect()
  if (status.value === 'ready') {
    void ensureContacts()
    await applyQuery()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', syncBreakpoint)
})

watch(
  () => [route.query.channelUrl, status.value] as const,
  ([url, current]) => {
    if (current !== 'ready') return
    const next = String(url ?? '').trim()
    if (next && next !== selectedUrl.value) void openThread(next)
    if (!next && !isSplit.value) clearThread()
  },
)

watch(
  () => [status.value, channels.value.length, isSplit.value] as const,
  ([current]) => {
    if (current !== 'ready') return
    void openFirstChannelIfNeeded()
  },
)
</script>

<template>
  <div
    class="bg-card overflow-hidden flex flex-col border-line
      max-md:-mx-4 max-md:rounded-none max-md:border-y max-md:border-x-0
      md:rounded-md md:border md:shadow-1
      lg:mx-0"
    :class="
      selectedUrl
        ? 'max-md:h-[calc(100dvh-3.5rem-2rem)] md:h-[calc(100dvh-3.5rem-5.5rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-3.5rem-3rem)]'
        : 'max-md:-mb-20 max-md:h-[calc(100dvh-3.5rem-4.5rem-env(safe-area-inset-bottom,0px))] md:h-[calc(100dvh-3.5rem-5.5rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-3.5rem-3rem)]'
    "
    data-testid="messages-inbox"
  >
    <div
      v-if="status === 'loading' || status === 'idle'"
      class="flex flex-1 items-center justify-center text-sm text-ink-3"
    >
      {{ t('common.info.loading') }}
    </div>

    <div
      v-else-if="status === 'unavailable'"
      class="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center"
    >
      <h1 class="text-[15px] font-semibold text-ink">
        {{ t('chat.heading.messages') }}
      </h1>
      <p class="text-sm text-ink-3 max-w-[40ch]">
        {{ t('chat.info.unavailable') }}
      </p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="flex flex-1 items-center justify-center px-6 text-center text-sm text-ink-3"
    >
      {{ t('chat.error.session') }}
    </div>

    <div
      v-else
      class="grid min-h-0 flex-1 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]"
    >
      <aside
        v-show="showList"
        class="min-h-0 overflow-y-auto border-line md:border-r"
        data-testid="messages-channel-list"
      >
        <div class="sticky top-0 z-10 bg-card px-4 py-3 border-b border-line space-y-2.5 md:space-y-3">
          <div>
            <h1 class="text-[15px] font-semibold text-ink">
              {{ t('chat.heading.messages') }}
            </h1>
            <p class="hidden sm:block text-[12.5px] text-ink-4 mt-0.5">
              {{ t('chat.info.subtitle') }}
            </p>
          </div>
          <label
            class="flex items-center gap-2 rounded-pill border border-line bg-surface-hover px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
          >
            <BaseIcon
              name="search"
              size="1.1em"
              class="text-ink-4 shrink-0"
            />
            <span class="sr-only">{{ t('chat.label.search_connections') }}</span>
            <input
              id="messages-search"
              v-model="search"
              type="search"
              autocomplete="off"
              data-testid="messages-search"
              :placeholder="t('chat.label.search_connections_placeholder')"
              class="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ink placeholder:text-ink-4 outline-none"
            >
          </label>
        </div>

        <template v-if="searchActive">
          <p
            v-if="contactsLoading && contacts.length === 0"
            class="px-5 py-4 text-center text-sm text-ink-3"
          >
            {{ t('common.info.loading') }}
          </p>
          <p
            v-else-if="contactsError && contacts.length === 0"
            class="px-5 py-4 text-center text-sm text-ink-3"
          >
            {{ t('chat.error.contacts') }}
          </p>
          <ChatEmptyState
            v-else-if="filteredContacts.length === 0"
            :title="t('chat.info.no_search_results')"
            :description="t('chat.info.no_search_results_hint')"
            icon="search"
          />
          <template v-else>
            <p class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-4">
              {{ t('chat.info.search_results') }}
            </p>
            <ChatContactRow
              v-for="contact in filteredContacts"
              :key="contact.id"
              :contact="contact"
              @click="startWithContact(contact.id)"
            />
          </template>
        </template>

        <template v-else>
          <template v-if="channels.length === 0">
            <ChatEmptyState
              :title="t('chat.info.no_messages_yet')"
              :description="
                contactsLoaded && contacts.length === 0
                  ? t('chat.info.empty_contacts')
                  : t('chat.info.empty_list')
              "
            />
            <template v-if="suggestedContacts.length > 0">
              <p class="px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-4">
                {{ t('chat.info.start_conversation') }}
              </p>
              <ChatContactRow
                v-for="contact in suggestedContacts"
                :key="contact.id"
                :contact="contact"
                @click="startWithContact(contact.id)"
              />
            </template>
          </template>
          <template v-else>
            <p class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-4">
              {{ t('chat.info.conversations') }}
            </p>
            <ChatChannelRow
              v-for="item in channels"
              :key="item.url"
              :item="item"
              :active="item.url === selectedUrl"
              @click="selectChannel(item.url)"
            />
          </template>
        </template>
      </aside>

      <div
        v-show="showThread"
        class="flex min-h-0 min-w-0"
        data-testid="messages-thread"
      >
        <ChatThread
          v-if="selected"
          :peer-name="selected.peer.nickname"
          :peer-id="selected.peer.userId"
          :peer-avatar="selected.peer.profileUrl"
          :my-user-id="myUserId"
          :messages="messages"
          :sending="sending"
          :error="threadError"
          :show-back="!isSplit"
          :delivery-status-for="deliveryStatusFor"
          :receipt-epoch="receiptEpoch"
          @back="onBack"
          @send="onSend"
          @react="onReact"
        />
        <div
          v-else
          class="hidden md:flex flex-1 items-center justify-center"
        >
          <ChatEmptyState
            :title="t('chat.info.select_conversation')"
            :description="t('chat.info.select_conversation_hint')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
