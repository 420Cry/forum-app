<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import { usePosts } from '~/composables/posts/usePosts'
import { useUpload } from '~/composables/posts/useUpload'
import type { PostUploadPayload } from '~/types/upload'
import ComposerCard from './ComposerCard.vue'
import PostComposer from './PostComposer.vue'
import FeedEmptyState from './FeedEmptyState.vue'
import PostCard from './PostCard.vue'
import PostCardSkeleton from './PostCardSkeleton.vue'
import LoadingSpinner from '~/components/shared/LoadingSpinner.vue'
import { useInfiniteScroll } from '@vueuse/core'

const { t } = useI18n()
const { activeAccount, handleAvatarError: handleAccountAvatarError }
  = useAccount()

const {
  posts,
  react,
  handleAvatarError,
  hasPosts,
  loadPosts,
  handlePostError,
  limit,
  isLoading,
  loadMore,
  isLoadingMore,
  hasMore,
} = usePosts()

const { isComposerOpen, openComposer, closeComposer } = useUpload()

// Publishing isn't wired to the backend yet — close the composer on submit.
const onSubmitPost = (_payload: PostUploadPayload) => {
  closeComposer()
}

useInfiniteScroll(
  window,
  async () => {
    if (!hasMore.value) {
      return
    }
    await loadMore()
  }, {
    distance: 10,
  },
)

onMounted(() => {
  loadPosts(limit.value)
})
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

  <div
    v-if="isLoading && !hasPosts"
    class="flex flex-col gap-3"
  >
    <PostCardSkeleton
      v-for="n in 3"
      :key="n"
    />
  </div>

  <FeedEmptyState v-else-if="!hasPosts" />

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

    <LoadingSpinner
      v-if="isLoadingMore"
      size="sm"
      class="py-4"
    />
  </div>
</template>
