<script setup lang="ts">
import { useSupabaseAuth } from '~/composables'
import { postAuthPath } from '~/types/user'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { user, logout, isAuthenticated } = useSupabaseAuth()
const { refreshProfile } = useUserProfile()

async function goToApp() {
  const me = await refreshProfile(true)
  await navigateTo(postAuthPath(me?.profile ?? null))
}
</script>

<template>
  <div
    v-if="isAuthenticated && user"
    class="space-y-6"
  >
    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600"
        >
          {{ user.email?.[0]?.toUpperCase() ?? "?" }}
        </div>
        <div>
          <p class="font-medium text-slate-800">
            {{ user.email }}
          </p>
          <p class="text-sm text-slate-500">
            {{ t('auth.info.signed_in_status') }}
          </p>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          @click="goToApp"
        >
          {{ t('common.action.continue') }}
        </button>
        <button
          type="button"
          class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="logout"
        >
          {{ t('common.action.sign_out') }}
        </button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-sm text-center"
  >
    <h2 class="text-xl font-semibold text-slate-800">
      {{ t('auth.heading.account') }}
    </h2>
    <p class="mt-2 text-slate-500">
      {{ t('auth.info.sign_in_or_create') }}
    </p>
    <div class="mt-6 flex flex-col gap-3">
      <NuxtLink
        to="/auth/login"
        class="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        {{ t('auth.action.sign_in') }}
      </NuxtLink>
      <NuxtLink
        to="/auth/register"
        class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        {{ t('auth.action.create_account') }}
      </NuxtLink>
    </div>
  </div>
</template>
