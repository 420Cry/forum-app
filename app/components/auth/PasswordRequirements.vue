<script setup lang="ts">
import {
  getPasswordChecks,
  passwordRequirementKeys,
  type PasswordRequirementKey,
} from '~/utils/passwordSchema'

const props = defineProps<{
  password: string
}>()

const { t } = useI18n()

const requirementCheckKey: Record<
  PasswordRequirementKey,
  keyof ReturnType<typeof getPasswordChecks>
> = {
  'auth.info.password_req_min_length': 'minLength',
  'auth.info.password_req_number': 'number',
  'auth.info.password_req_uppercase': 'uppercase',
  'auth.info.password_req_lowercase': 'lowercase',
  'auth.info.password_req_special': 'special',
}

const checks = computed(() => getPasswordChecks(props.password))
</script>

<template>
  <div class="mt-2 space-y-1">
    <p class="text-xs font-medium text-ink-3">
      {{ t('auth.info.password_requirements') }}
    </p>
    <ul class="space-y-1">
      <li
        v-for="key in passwordRequirementKeys"
        :key="key"
        class="flex items-center gap-2 text-xs"
        :class="checks[requirementCheckKey[key]] ? 'text-green-700' : 'text-ink-4'"
      >
        <span
          class="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]"
          :class="
            checks[requirementCheckKey[key]]
              ? 'border-green-600 bg-green-50'
              : 'border-line-2 bg-surface'
          "
          aria-hidden="true"
        >
          {{ checks[requirementCheckKey[key]] ? '✓' : '○' }}
        </span>
        <span>{{ t(key) }}</span>
      </li>
    </ul>
  </div>
</template>
