<script setup lang="ts">
import type { Post } from '~/types/post'
import type { ReactionType } from '~/types/reaction'
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import BasePill from '~/components/shared/BasePill.vue'
import ReactionCount from './ReactionCount.vue'
import PostReactions from './PostReactions.vue'

const props = defineProps<{ post: Post }>()

const emit = defineEmits<{
  react: [postId: string, type: ReactionType]
  avatarError: [id: string]
  imageError: [postId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-md border border-line bg-card shadow-1"
  >
    <header class="flex items-start gap-3 px-[18px] pb-2 pt-3.5">
      <AccountAvatar
        :account="props.post.author"
        :handle-avatar-error="id => emit('avatarError', id)"
        size="size-12"
        text-class="text-base"
      />
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="text-[14.5px] font-semibold tracking-[-0.005em] text-ink"
          >
            {{ props.post.author.name }}
          </span>
          <BasePill
            :variant="
              props.post.author.accountType === 'startup'
                ? props.post.author.stage
                : 'investor'
            "
          />
        </div>
        <p class="mt-0.5 text-[12.5px] text-ink-3">
          {{ props.post.author.headline }}
        </p>
        <div
          class="mt-0.5 flex items-center gap-[5px] text-[11.5px] text-ink-4"
        >
          <span>{{ props.post.time }}</span>
          <span class="size-[2px] rounded-full bg-ink-5" />
          <span>{{ t(`feed.visibility.${props.post.visibility}`) }}</span>
        </div>
      </div>
      <button
        type="button"
        :aria-label="t('feed.label.soon')"
        class="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-4 hover:bg-surface-hover hover:text-ink-2"
      >
        <BaseIcon
          name="kebab"
          size="20px"
        />
      </button>
    </header>

    <p class="px-[18px] pb-3.5 pt-1 text-sm leading-[1.55] text-ink-2">
      {{ props.post.content }}
    </p>

    <div
      v-if="!props.post.imageUrl || props.post.imageLoadFailed"
      class="flex h-80 w-full items-center justify-center bg-[repeating-linear-gradient(135deg,#F3F1EC_0_8px,#EAE7E0_8px_16px)] text-[11.5px] font-medium uppercase tracking-[0.04em] text-ink-4"
    >
      <span>{{ t('feed.info.image_unavailable') }}</span>
    </div>

    <img
      v-else
      :src="props.post.imageUrl"
      :alt="props.post.author.headline"
      class="h-80 w-full object-cover"
      @error="emit('imageError', props.post.id)"
    />

    <div class="px-[18px] pb-2 pt-2.5">
      <ReactionCount :post="props.post" />
    </div>
    <div class="mx-[18px] h-px bg-line" />
    <PostReactions
      :post="props.post"
      @react="(postId, type) => emit('react', postId, type)"
    />
  </article>
</template>
