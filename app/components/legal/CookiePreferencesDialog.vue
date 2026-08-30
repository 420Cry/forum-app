<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseDrawer from '~/components/shared/BaseDrawer.vue'
import { useCookieConsent } from '~/composables/useCookieConsent'
import type { OptionalConsent } from '~/utils/cookieConsent'

const { t } = useI18n()
const {
  consent,
  preferencesOpen,
  acceptAll,
  rejectAll,
  save,
  closePreferences,
} = useCookieConsent()

const draft = reactive<OptionalConsent>({
  performance: false,
  functional: false,
  targeting: false,
})

watch(
  preferencesOpen,
  (open) => {
    if (!open) return
    draft.performance = consent.value?.performance ?? false
    draft.functional = consent.value?.functional ?? false
    draft.targeting = consent.value?.targeting ?? false
  },
  { immediate: true },
)

const groups: Array<{
  key: keyof OptionalConsent
  heading: string
  info: string
  aria: string
}> = [
  {
    key: 'performance',
    heading: 'common.heading.cookie_performance',
    info: 'common.info.cookie_performance',
    aria: 'common.aria.cookie_performance',
  },
  {
    key: 'functional',
    heading: 'common.heading.cookie_functional',
    info: 'common.info.cookie_functional',
    aria: 'common.aria.cookie_functional',
  },
  {
    key: 'targeting',
    heading: 'common.heading.cookie_targeting',
    info: 'common.info.cookie_targeting',
    aria: 'common.aria.cookie_targeting',
  },
]

function toggle(key: keyof OptionalConsent) {
  draft[key] = !draft[key]
}

function onSave() {
  save({ ...draft })
}
</script>

<template>
  <BaseDrawer
    v-model:open="preferencesOpen"
    :title="t('common.heading.cookie_preferences')"
    @close="closePreferences"
  >
    <p class="text-base text-ink-2">
      {{ t('common.info.cookie_preferences') }}
    </p>

    <div class="mt-4 flex items-start gap-3 border-t border-line py-3.5">
      <div class="min-w-0 flex-1">
        <p class="text-[14px] font-semibold text-ink">
          {{ t('common.heading.cookie_necessary') }}
        </p>
        <p class="mt-1 text-[14px] text-ink-3">
          {{ t('common.info.cookie_necessary') }}
        </p>
        <p class="mt-1 text-[12.5px] font-semibold text-ink-4">
          {{ t('common.label.cookie_always_on') }}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        class="relative mt-0.5 h-6 w-10 flex-none rounded-pill bg-brand opacity-60"
        aria-checked="true"
        :aria-label="t('common.aria.cookie_necessary')"
        disabled
      >
        <span class="absolute top-0.5 left-0.5 size-5 translate-x-4 rounded-full bg-white shadow-1" />
      </button>
    </div>

    <div
      v-for="group in groups"
      :key="group.key"
      class="flex items-start gap-3 border-t border-line py-3.5"
    >
      <div class="min-w-0 flex-1">
        <p class="text-[14px] font-semibold text-ink">
          {{ t(group.heading) }}
        </p>
        <p class="mt-1 text-[14px] text-ink-3">
          {{ t(group.info) }}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        class="relative mt-0.5 h-6 w-10 flex-none cursor-pointer rounded-pill transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        :class="draft[group.key] ? 'bg-brand' : 'bg-line'"
        :aria-checked="draft[group.key]"
        :aria-label="t(group.aria)"
        @click="toggle(group.key)"
      >
        <span
          class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-1 transition-transform duration-150"
          :class="draft[group.key] ? 'translate-x-4' : 'translate-x-0'"
        />
      </button>
    </div>

    <template #footer>
      <div class="flex flex-col gap-2">
        <BaseButton
          intent="primary"
          size="sm"
          block
          :aria-label="t('common.aria.accept_all')"
          @click="acceptAll"
        >
          {{ t('common.action.accept_all') }}
        </BaseButton>
        <BaseButton
          intent="secondary"
          size="sm"
          block
          :aria-label="t('common.aria.save_configuration')"
          @click="onSave"
        >
          {{ t('common.action.save_configuration') }}
        </BaseButton>
        <BaseButton
          intent="secondary"
          size="sm"
          block
          :aria-label="t('common.aria.reject_all')"
          @click="rejectAll"
        >
          {{ t('common.action.reject_all') }}
        </BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>
