<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()

useHead({
  title: () => t('common.heading.terms'),
})
</script>

<template>
  <article class="mx-auto max-w-prose pb-8">
    <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink">
      {{ t('common.heading.terms') }}
    </h1>
    <p class="mt-3 text-base text-ink-2">
      {{ t('common.info.terms_intro') }}
    </p>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.terms_use') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.terms_use') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.terms_account') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.terms_account') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.terms_content') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.terms_content') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.terms_acceptable') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.terms_acceptable') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.terms_changes') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.terms_changes') }}
      </p>
    </section>
  </article>
</template>
