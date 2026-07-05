<template>
  <div class="min-h-screen bg-surface">
    <header class="border-b border-line bg-card">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <h1 class="text-xl font-semibold text-ink">
          {{ $t('common.heading.forum') }}
        </h1>
        <LocaleSwitcher />
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
