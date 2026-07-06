<script setup lang="ts">
definePageMeta({ layout: 'auth', access: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-sm text-center">
    <h2 class="text-xl font-semibold text-slate-800">
      {{ t('auth.heading.account') }}
    </h2>
    <p class="mt-2 text-slate-500">
      {{ t('auth.info.sign_in_or_create') }}
    </p>
    <div class="mt-6 flex flex-col gap-3">
      <NuxtLink
        :to="localePath('/auth/login')"
        class="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        {{ t('auth.action.sign_in') }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('/auth/register')"
        class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        {{ t('auth.action.create_account') }}
      </NuxtLink>
    </div>
  </div>
</template>
