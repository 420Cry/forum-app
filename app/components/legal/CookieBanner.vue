<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import { useCookieConsent } from '~/composables/useCookieConsent'

const { t } = useI18n()
const localePath = useLocalePath()
const { hasDecision, acceptAll, rejectAll, openPreferences } = useCookieConsent()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-[450ms] ease-[cubic-bezier(.2,.7,.3,1)] motion-reduce:transition-none"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <aside
        v-if="!hasDecision"
        class="fixed inset-x-4 bottom-4 z-80 max-w-[500px] rounded-md border border-line bg-card p-5 shadow-pop sm:right-auto"
        role="region"
        :aria-label="t('common.aria.cookie_banner')"
      >
        <h2 class="text-[16px] font-bold tracking-[-0.02em] text-ink">
          {{ t('common.heading.cookie_banner') }}
        </h2>
        <p class="mt-2 text-base text-ink-2">
          {{ t('common.info.cookie_banner') }}
        </p>
        <i18n-t
          keypath="common.info.cookie_banner_more"
          tag="p"
          class="mt-3 text-base text-ink-2"
        >
          <template #policy>
            <NuxtLink
              :to="localePath('/legal/cookies')"
              class="font-semibold text-brand no-underline hover:underline"
            >
              {{ t('common.action.cookie_policy') }}
            </NuxtLink>
          </template>
        </i18n-t>
        <div class="mt-4 flex flex-col gap-2">
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
            :aria-label="t('common.aria.cookie_configuration')"
            @click="openPreferences"
          >
            {{ t('common.action.cookie_configuration') }}
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
      </aside>
    </Transition>
  </Teleport>
</template>
