<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseDrawer from '~/components/shared/BaseDrawer.vue'
import CookieSwitch from '~/components/legal/CookieSwitch.vue'
import { useCookieConsent } from '~/composables/useCookieConsent'
import {
  OPTIONAL_GROUP_COPY,
  type OptionalConsent,
} from '~/utils/cookieConsent'

const { t } = useI18n()
const {
  consent,
  preferencesOpen,
  acceptAll,
  rejectAll,
  save,
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
    Object.assign(draft, {
      performance: consent.value?.performance ?? false,
      functional: consent.value?.functional ?? false,
      targeting: consent.value?.targeting ?? false,
    })
  },
  { immediate: true },
)
</script>

<template>
  <BaseDrawer
    v-model:open="preferencesOpen"
    :title="t('common.heading.cookie_preferences')"
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
      <CookieSwitch
        on
        disabled
        :label="t('common.aria.cookie_necessary')"
      />
    </div>

    <div
      v-for="group in OPTIONAL_GROUP_COPY"
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
      <CookieSwitch
        :on="draft[group.key]"
        :label="t(group.aria)"
        @toggle="draft[group.key] = !draft[group.key]"
      />
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
          @click="save({ ...draft })"
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
