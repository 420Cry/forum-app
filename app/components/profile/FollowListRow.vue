<script setup lang="ts">
import FollowButton from '~/components/social/FollowButton.vue'
import type { AccountSummaryView } from '~/types/profile'

const props = defineProps<{
  item: AccountSummaryView
}>()

const emit = defineEmits<{
  'navigate': []
  'follow-change': [following: boolean]
}>()

const localePath = useLocalePath()
const avatarFailed = ref(false)

const profileTo = computed(() => localePath(props.item.href))

function onNavigate() {
  emit('navigate')
}
</script>

<template>
  <div class="flex items-center gap-3 px-1 py-2.5">
    <NuxtLink
      :to="profileTo"
      class="size-11 shrink-0 rounded-full overflow-hidden no-underline"
      @click="onNavigate"
    >
      <img
        v-if="item.avatar && !avatarFailed"
        :src="item.avatar"
        :alt="item.name"
        class="size-full object-cover"
        @error="avatarFailed = true"
      >
      <span
        v-else
        class="flex size-full items-center justify-center text-[13px] font-semibold text-white"
        :style="{ backgroundImage: item.avatarColor }"
      >
        {{ item.prefix }}
      </span>
    </NuxtLink>

    <NuxtLink
      :to="profileTo"
      class="min-w-0 flex-1 no-underline"
      @click="onNavigate"
    >
      <p class="truncate text-[14px] font-semibold text-ink leading-tight">
        {{ item.name }}
      </p>
      <p
        v-if="item.subtitle || item.location"
        class="truncate text-[12.5px] text-ink-4 mt-0.5 leading-snug"
      >
        {{ item.subtitle || item.location }}
      </p>
    </NuxtLink>

    <div class="shrink-0">
      <FollowButton
        :target-type="item.accountType"
        :target-id="item.id"
        @change="emit('follow-change', $event)"
      />
    </div>
  </div>
</template>
