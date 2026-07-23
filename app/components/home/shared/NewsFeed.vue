<script setup lang="ts">
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import BasePill from '~/components/shared/BasePill.vue'
import BaseReaction from '~/components/shared/BaseReaction.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import { useSuggestedPosts } from '~/composables/posts/useSuggestedPosts'
import { reactionList } from '~/constants/reactions'
import ReactionCount from '../ReactionCount.vue'

const { activeAccount, isUserPaid } = useAccount()
const {
  suggestedPosts,
  handleAvatarError,
  hasPosts,
  togglePost,
  handlePostError,
} = useSuggestedPosts()
</script>

<template>
  <div
    v-if="activeAccount?.accountType === 'user'"
    class="bg-card w-full border border-line shadow-1 rounded-md p-4 flex gap-3"
  >
    <BaseIcon
      name="visibility"
      class="size-10 text-brand bg-brand-50 p-2 rounded-full"
    />

    <div class="flex flex-col gap-1">
      <p class="text-sm font-bold">
        You're browsing in reader mode
      </p>
      <p class="text-sm text-ink-3">
        Watch and react to updates from founders and investors. Posting is
        available once you add a startup or investor page.
      </p>
    </div>
  </div>

  <div v-if="activeAccount?.accountType !== 'user'">
    <div
      v-if="!isUserPaid"
      class="bg-card w-full border border-line shadow-1 rounded-md p-4 flex gap-3"
    >
      <BaseIcon
        name="upload"
        class="size-10 text-brand bg-brand-50 p-2 rounded-full"
      />

      <div class="flex flex-col gap-1">
        <p class="text-sm font-bold">
          Subscribe to our Pro plan
        </p>
        <p class="text-sm text-ink-3">
          By subscribing to our Pro plan, you can upload your posts, communicate
          with different startups or investors, and more benefits coming your
          way!
        </p>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div
        class="bg-card w-full border border-line shadow-1 rounded-md p-4 flex gap-3"
      ></div>

      <div
        class="bg-card w-full border border-line shadow-1 rounded-md p-2 flex gap-4"
      >
        <p
          class="hover:bg-brand-50 hover:text-brand hover:font-semibold p-2 rounded-md"
        >
          All updates
        </p>
        <p
          class="hover:bg-brand-50 hover:text-brand hover:font-semibold p-2 rounded-md"
        >
          Following
        </p>

        <button @click="togglePost">
          Switch posts mode
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="!hasPosts"
    class="w-full bg-card flex flex-col gap-4 items-center p-8 border border-line shadow-1 rounded-md"
  >
    <BaseIcon
      name="following"
      class="bg-brand-50 rounded-full size-14 p-3 text-brand"
    />
    <p class="font-bold">
      Your feed is empty
    </p>
    <p class="text-center text-sm max-w-sm text-ink-3">
      Follow founders and investors to see their updates here, then back the
      ones you believe in. We've picked a few to get you started.
    </p>

    <BaseButton>Browse suggestions</BaseButton>
  </div>

  <div
    v-if="hasPosts"
    class="flex flex-col gap-4"
  >
    <div
      v-for="post in suggestedPosts"
      :key="post.id"
      class="w-full bg-card flex flex-col gap-2 items-center border border-line shadow-1 rounded-md"
    >
      <div class="w-full flex justify-between py-2 px-4">
        <div class="flex gap-2">
          <AccountAvatar
            :account="post.author"
            :handle-avatar-error="handleAvatarError"
            size="size-12"
          />
          <div class="flex flex-col gap-1">
            <div class="flex gap-3 items-center">
              <p class="font-semibold text-sm">
                {{ post.author.name }}
              </p>
              <BasePill
                :variant="
                  post.author.accountType === 'startup'
                    ? post.author.stage
                    : 'investor'
                "
              />
            </div>

            <p class="text-ink-3 text-sm">
              {{ post.author.headline }}
            </p>
            <p class="text-ink-3 text-sm">
              {{ post.time }}
            </p>
          </div>
        </div>
        <div>...</div>
      </div>

      <div class="px-4">
        <p>{{ post.content }}</p>
      </div>

      <div
        v-if="!post.imageUrl || post.imageLoadFailed"
        class="flex h-80 w-full items-center mt-2 justify-center bg-[repeating-linear-gradient(135deg,#F3F1EC_0_8px,#EAE7E0_8px_16px)] text-[11.5px] font-medium uppercase tracking-[0.04em] text-ink-4"
      >
        <span>Image unavailable</span>
      </div>

      <img
        v-else
        :src="post.imageUrl"
        :alt="post.author.headline"
        class="h-80 w-full object-cover mt-2"
        @error="handlePostError(post.id)"
      />
      <div class="w-full flex gap-2 items-center">
        <div class="py-2 px-4 flex gap-2 items-center">
          <BaseReaction
            v-for="reaction in reactionList"
            :key="reaction.key"
            :intent="reaction.key"
          />
          <ReactionCount :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>
