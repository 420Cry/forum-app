<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import { usePosts } from '~/composables/posts/usePosts'
import { useUpload } from '~/composables/posts/useUpload'
import type { PostUploadPayload } from '~/types/upload'
import ComposerCard from './ComposerCard.vue'
import PostComposer from './PostComposer.vue'
import FeedFilterBar from './FeedFilterBar.vue'
import FeedEmptyState from './FeedEmptyState.vue'
import PostCard from './PostCard.vue'

const { t } = useI18n()
const {
  activeAccount,
  isUserPaid,
  handleAvatarError: handleAccountAvatarError,
} = useAccount()

const {
  posts,
  react,
  handleAvatarError,
  hasPosts,
  togglePost,
  handlePostError,
} = usePosts()

const { isComposerOpen, openComposer, closeComposer } = useUpload()

// Publishing isn't wired to the backend yet — close the composer on submit.
const onSubmitPost = (_payload: PostUploadPayload) => {
  closeComposer()
}
</script>

<template>
  <!-- Reader-mode banner — personal accounts watch + react, they can't post -->
  <div
    v-if="activeAccount?.accountType === 'user'"
    class="flex items-start gap-3 rounded-md border border-line bg-card px-4 py-3.5 shadow-1"
  >
    <span
      class="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand"
    >
      <BaseIcon
        name="visibility"
        size="18px"
      />
    </span>
    <div>
      <p class="text-[13.5px] font-semibold text-ink">
        {{ t('feed.heading.reader_mode') }}
      </p>
      <p class="mt-0.5 text-[12.5px] leading-normal text-ink-3">
        {{ t('feed.info.reader_mode') }}
      </p>
    </div>
  </div>

  <ComposerCard
    v-else
    :account="activeAccount"
    :is-user-paid="isUserPaid"
    @open-composer="openComposer"
    @avatar-error="handleAccountAvatarError"
  />

  <PostComposer
    v-if="isComposerOpen && activeAccount"
    :account="activeAccount"
    :handle-avatar-error="handleAccountAvatarError"
    @close="closeComposer"
    @submit="onSubmitPost"
  />

  <!-- Sort also toggles the mock feed while the real fetch is a dev scaffold. -->
  <FeedFilterBar @sort="togglePost" />

  <FeedEmptyState v-if="!hasPosts" />

  <div
    v-else
    class="flex flex-col gap-3"
  >
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @react="react"
      @avatar-error="handleAvatarError"
      @image-error="handlePostError"
    />
  </div>
</template>
