<script setup lang="ts">
import ChatChannelRow from '~/components/chat/ChatChannelRow.vue'
import ChatContactRow from '~/components/chat/ChatContactRow.vue'
import ChatEmptyState from '~/components/chat/ChatEmptyState.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import type { ChatListItem } from '~/types/chat'
import type { UserConnection } from '~/types/profile'
import { foldSearchText } from '~/utils/foldSearchText'

const props = defineProps<{
  channels: ChatListItem[]
  selectedUrl: string | null
  contacts: UserConnection[]
  contactsLoaded: boolean
  contactsLoading: boolean
  contactsError: boolean
}>()

const emit = defineEmits<{
  select: [url: string]
  contact: [userId: string]
}>()

const { t } = useI18n()
const search = ref('')

const searchActive = computed(() => search.value.trim().length > 0)

const filteredContacts = computed(() => {
  const q = foldSearchText(search.value.trim())
  if (!q) return props.contacts
  return props.contacts.filter((contact) => {
    const name = foldSearchText(contact.name)
    const key = foldSearchText(contact.urlKey ?? '')
    const headline = foldSearchText(contact.headline ?? '')
    return name.includes(q) || key.includes(q) || headline.includes(q)
  })
})

const suggestedContacts = computed(() => {
  const list = props.contacts
  const mutual = list.filter(c => c.relation === 'mutual')
  const rest = list.filter(c => c.relation !== 'mutual')
  return [...mutual, ...rest].slice(0, 12)
})

function clearSearch() {
  search.value = ''
}

function onSelect(url: string) {
  clearSearch()
  emit('select', url)
}

function onContact(userId: string) {
  clearSearch()
  emit('contact', userId)
}

defineExpose({ clearSearch })
</script>

<template>
  <aside
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
          @click="onContact(contact.id)"
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
            @click="onContact(contact.id)"
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
          @click="onSelect(item.url)"
        />
      </template>
    </template>
  </aside>
</template>
