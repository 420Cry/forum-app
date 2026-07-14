<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader is-protected-route />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
