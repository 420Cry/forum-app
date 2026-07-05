<template>
  <div class="min-h-screen bg-surface">
    <header class="h-14 border-b border-line bg-card">
      <div class="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
        <SharedAppLogo />
        <LocaleSwitcher />
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
