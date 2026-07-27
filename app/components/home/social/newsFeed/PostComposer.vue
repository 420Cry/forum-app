<script setup lang="ts">
import type { AccountSummaryView } from '~/types/profile'
import type { PostUploadPayload } from '~/types/upload'
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { POST_AUDIENCE_OPTIONS } from '~/constants/posts'

const props = defineProps<{
  account: AccountSummaryView
  handleAvatarError: (id: string) => void
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: PostUploadPayload]
}>()

const { t } = useI18n()

const draft = reactive<PostUploadPayload>({
  author_id: props.account.id,
  content: '',
  image: null,
  visibility: 'public',
})

const canPost = computed(() => draft.content.trim().length > 0)

// Audience selector
const isAudienceOpen = ref(false)
const selectedAudience = computed(
  () =>
    POST_AUDIENCE_OPTIONS.find(o => o.visibility === draft.visibility)
    ?? POST_AUDIENCE_OPTIONS[0]!,
)

const selectAudience = (visibility: PostUploadPayload['visibility']) => {
  draft.visibility = visibility
  isAudienceOpen.value = false
}

// Auto-grow the textarea as the founder types (bounded by max-height in class).
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const grow = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

const submit = () => {
  if (!canPost.value) return
  emit('submit', { ...draft })
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  textareaRef.value?.focus()
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    class="fixed left-1/2 top-1/2 z-(--z-modal) flex max-h-[calc(100vh-80px)] w-[560px] max-w-[calc(100%-40px)] -translate-1/2  flex-col overflow-hidden rounded-xl bg-card shadow-pop"
    role="dialog"
    aria-modal="true"
    :aria-label="t('feed.composer.title')"
  >
    <!-- Header -->
    <header
      class="relative flex items-center justify-center border-b border-line px-5 py-4"
    >
      <span class="text-base font-semibold text-ink">
        {{ t('feed.composer.title') }}
      </span>
      <button
        type="button"
        :aria-label="t('feed.composer.close')"
        class="absolute right-3 top-1/2 flex size-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-surface-hover text-ink-3 transition-colors hover:bg-surface-hover-2 hover:text-ink"
        @click="emit('close')"
      >
        <BaseIcon
          name="close"
          size="20px"
        />
      </button>
    </header>

    <!-- Identity row: avatar · name · audience selector -->
    <div class="flex items-start gap-3 px-5 pb-1 pt-4">
      <AccountAvatar
        :account="account"
        :handle-avatar-error="handleAvatarError"
        size="size-11"
      />
      <div class="flex min-w-0 flex-col gap-[5px]">
        <span class="text-[15px] font-semibold text-ink">
          {{ account.name }}
        </span>
        <div class="relative">
          <button
            type="button"
            aria-haspopup="menu"
            :aria-expanded="isAudienceOpen"
            class="inline-flex items-center gap-1.5 rounded-sm bg-brand-tint px-2.5 py-[5px] text-[12.5px] font-semibold text-brand transition-colors hover:bg-brand-100"
            :class="{ 'bg-brand-100': isAudienceOpen }"
            @click="isAudienceOpen = !isAudienceOpen"
          >
            <BaseIcon
              :name="selectedAudience.icon"
              size="15px"
            />
            <span>
              {{
                t(`feed.composer.audience.${selectedAudience.visibility}.label`)
              }}
            </span>
            <BaseIcon
              name="chevron"
              size="15px"
              class="transition-transform"
              :class="{ 'rotate-180': isAudienceOpen }"
            />
          </button>

          <!-- Audience menu -->
          <div
            v-if="isAudienceOpen"
            role="menu"
            class="absolute left-0 top-[calc(100%+6px)] z-(--z-popover) w-[300px] rounded-md border border-line bg-card p-1.5 shadow-pop"
          >
            <div
              class="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-4"
            >
              {{ t('feed.composer.audience_label') }}
            </div>
            <button
              v-for="option in POST_AUDIENCE_OPTIONS"
              :key="option.visibility"
              type="button"
              role="menuitemradio"
              :aria-checked="option.visibility === draft.visibility"
              class="flex w-full items-center gap-3 rounded-sm px-2.5 py-[9px] text-left hover:bg-surface-hover"
              :class="{
                'bg-brand-tint': option.visibility === draft.visibility,
              }"
              @click="selectAudience(option.visibility)"
            >
              <span
                class="flex size-[34px] shrink-0 items-center justify-center rounded-full"
                :class="
                  option.visibility === draft.visibility
                    ? 'bg-brand-100 text-brand'
                    : 'bg-surface-hover-2 text-ink-2'
                "
              >
                <BaseIcon
                  :name="option.icon"
                  size="18px"
                />
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                <span class="text-[13.5px] font-semibold text-ink">
                  {{ t(`feed.composer.audience.${option.visibility}.label`) }}
                </span>
                <span class="text-[11.5px] text-ink-3">
                  {{
                    t(`feed.composer.audience.${option.visibility}.note`, {
                      name: account.name,
                    })
                  }}
                </span>
              </span>
              <BaseIcon
                v-if="option.visibility === draft.visibility"
                name="checkMark"
                size="18px"
                class="shrink-0 text-brand"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <textarea
      ref="textareaRef"
      v-model="draft.content"
      class="max-h-[340px] min-h-[150px] resize-none overflow-y-auto bg-transparent px-5 pb-[18px] pt-3 text-[15px] leading-[1.55] text-ink outline-none placeholder:text-ink-4"
      :placeholder="t('feed.composer.placeholder', { name: account.name })"
      @input="grow"
    />

    <!-- Footer -->
    <footer class="flex flex-col gap-3.5 px-5 pb-5">
      <div
        class="flex items-center justify-between rounded-lg border border-line px-3.5 py-3"
      >
        <span class="text-[13px] font-semibold text-ink-2">
          {{ t('feed.composer.add_to_post') }}
        </span>
        <button
          type="button"
          :aria-label="t('feed.composer.add_photo')"
          :title="t('feed.composer.add_photo')"
          class="flex size-[38px] items-center justify-center rounded-sm text-[#4E9A66] transition-colors hover:bg-surface-hover"
        >
          <BaseIcon
            name="camera"
            size="20px"
          />
        </button>
      </div>
      <BaseButton
        class="w-full justify-center"
        :disabled="!canPost"
        @click="submit"
      >
        {{ t('feed.composer.post') }}
      </BaseButton>
    </footer>
  </div>
</template>
