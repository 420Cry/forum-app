<script setup lang="ts">
import type { Post } from '~/types/post'
import BaseReaction from '~/components/shared/BaseReaction.vue'

const props = defineProps<{ post: Post }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-between text-[12.5px] text-ink-4">
    <div class="flex items-center gap-1.5">
      <span
        v-if="props.post.top_reactions.length"
        class="flex items-center"
      >
        <BaseReaction
          v-for="reaction in props.post.top_reactions"
          :key="reaction"
          :intent="reaction"
          size="md"
          class="-ml-1.5 ring-2 ring-card first:ml-0"
        />
      </span>
      <span>
        {{ t('feed.stats.reactions', { count: props.post.reaction_counts }) }}
      </span>
    </div>

    <div class="flex items-center gap-3.5">
      <span>{{
        t('feed.stats.comments', { count: props.post.comments })
      }}</span>
      <span>{{ t('feed.stats.shares', { count: props.post.shares }) }}</span>
    </div>
  </div>
</template>
