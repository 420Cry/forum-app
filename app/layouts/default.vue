<template>
  <div class="min-h-screen bg-surface">
    <header class="h-14 border-b border-line bg-card">
      <div class="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
        <SharedAppLogo />
        <LocaleSwitcher />
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
