<script setup lang="ts">
import type { Post } from '~/types/post'
import BaseReaction from '~/components/shared/BaseReaction.vue'
import {
  reactionList,
  defaultReaction,
  reactionActiveColor,
  reactionActiveName,
} from '~/constants/reactions'
import type { ReactionType } from '~/types/reaction'
import BaseIcon from '~/components/shared/BaseIcon.vue'

const props = defineProps<{ post: Post }>()
const emit = defineEmits<{ react: [postId: string, type: ReactionType] }>()
const { t } = useI18n()

// Shared shape for the three action buttons (react / comment / share).
const actionBase
  = 'flex flex-1 items-center justify-center gap-[7px] rounded-sm px-3.5 py-[9px] text-[13px] font-semibold transition-colors'
const soonBadge
  = 'rounded-pill bg-surface-hover-2 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.04em] text-ink-4'
</script>

<template>
  <div class="flex items-center justify-between px-3 pb-2 pt-1.5">
    <!-- Back / reaction: primary action with hover picker -->
    <div class="group relative flex-1">
      <div
        class="invisible absolute -top-13 -left-2 z-40 flex translate-y-1.5 items-center gap-1 rounded-pill border border-line bg-card p-1.5 opacity-0 shadow-pop transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <button
          v-for="reaction in reactionList"
          :key="reaction.key"
          type="button"
          :aria-label="reaction.name"
          :title="reaction.name"
          class="flex cursor-pointer transition-transform hover:scale-110"
          @click="emit('react', props.post.id, reaction.key)"
        >
          <BaseReaction :intent="reaction.key" />
        </button>
      </div>

      <button
        v-if="!props.post.reacted_type"
        type="button"
        :class="`${actionBase} cursor-pointer text-ink-3 hover:bg-surface-hover hover:text-ink`"
        @click="emit('react', props.post.id, defaultReaction?.key as ReactionType)"
      >
        <BaseIcon
          :name="defaultReaction?.key as ReactionType"
          size="18px"
        />
        <span>{{ defaultReaction?.name ?? 'Back' }}</span>
      </button>

      <button
        v-else
        type="button"
        :class="[
          actionBase,
          'cursor-pointer hover:bg-surface-hover',
          reactionActiveColor(props.post.reacted_type as ReactionType)
            ?? 'text-brand',
        ]"
        @click="emit('react', props.post.id, props.post.reacted_type)"
      >
        <BaseReaction
          :intent="props.post.reacted_type as ReactionType"
          active
          size="sm"
        />
        <span>
          {{
            reactionActiveName(props.post.reacted_type as ReactionType)
              ?? props.post.reacted_type
          }}
        </span>
      </button>
    </div>

    <!-- Comment / Share: placeholders until the features ship -->
    <button
      type="button"
      disabled
      :class="`${actionBase} cursor-default text-ink-4`"
    >
      <BaseIcon
        name="message"
        size="18px"
      />
      <span>{{ t('feed.action.comment') }}</span>
      <span :class="soonBadge">{{ t('feed.label.soon') }}</span>
    </button>

    <button
      type="button"
      disabled
      :class="`${actionBase} cursor-default text-ink-4`"
    >
      <BaseIcon
        name="share"
        size="18px"
      />
      <span>{{ t('feed.action.share') }}</span>
      <span :class="soonBadge">{{ t('feed.label.soon') }}</span>
    </button>
  </div>
</template>
