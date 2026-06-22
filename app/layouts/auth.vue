<template>
  <div class="min-h-screen bg-surface">
    <header class="border-b border-line bg-card">
      <div
        class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4"
      >
        <h1 class="text-xl font-semibold text-ink">Forum</h1>
        <NuxtLink to="/" class="text-sm text-ink-4 hover:text-ink">
          ← Back
        </NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
