<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader show-sign-out />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
