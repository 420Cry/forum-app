<script setup lang="ts">
import type { Post } from '~/types/post'
import BaseReaction from '../shared/BaseReaction.vue'

const props = defineProps<{ post: Post }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div>
      <BaseReaction
        v-for="reaction in props.post.top_reactions"
        :key="reaction"
        :intent="reaction"
        size="md"
      />
    </div>
    <p class="text-ink-3 text-sm">
      {{ props.post.reaction_counts }} counts
    </p>
  </div>
</template>
