<script setup lang="ts">
import BaseInput from '~/components/shared/BaseInput.vue'

const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    id: string
    label: string
    placeholder?: string
    intent?: 'primary' | 'error'
    errorMsg?: string
    reserveError?: boolean
  }>(),
  {
    placeholder: '',
    intent: 'primary',
    errorMsg: '',
    reserveError: true,
  },
)

const show = ref(false)
const { t } = useI18n()

const inputType = computed(() => (show.value ? 'text' : 'password'))
</script>

<template>
  <div class="min-w-0">
    <div class="mb-1 flex items-center justify-between gap-2">
      <label
        :for="id"
        class="text-sm font-semibold text-ink-2"
      >
        {{ label }}
      </label>
      <slot name="link" />
    </div>
    <div class="relative [&_input]:h-[46px] [&_input]:pr-11 [&_input]:text-sm">
      <BaseInput
        :id="id"
        v-model="model"
        :type="inputType"
        :placeholder="placeholder"
        :intent="intent"
        :error-msg="errorMsg"
        :reserve-error="reserveError"
        label=""
      />
      <button
        type="button"
        class="absolute top-[11px] right-1.5 flex size-8 cursor-pointer items-center justify-center rounded-sm text-ink-4 hover:bg-surface-hover hover:text-ink-2"
        :aria-label="show ? t('auth.action.hide_password') : t('auth.action.show_password')"
        @click="show = !show"
      >
        <svg
          v-if="show"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M3.5 3.5l13 13" />
          <path d="M8 5.2A8.6 8.6 0 0 1 10 5c5 0 8 5 8 5a13.5 13.5 0 0 1-2.2 2.6M6.3 6.5C3.6 7.9 2 10 2 10s3 5 8 5a8.3 8.3 0 0 0 2.6-.42" />
          <path d="M8.3 8.5a2.4 2.4 0 0 0 3.3 3.4" />
        </svg>
        <svg
          v-else
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" />
          <circle
            cx="10"
            cy="10"
            r="2.4"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
