<template>
  <div class="min-h-screen bg-bgColor">
    <header class="border-b bg-white">
      <div
        class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4"
      >
        <h1 class="text-xl font-semibold text-slate-800">Forum</h1>
        <NuxtLink to="/" class="text-sm text-slate-500 hover:text-slate-800">
          ← Back
        </NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
