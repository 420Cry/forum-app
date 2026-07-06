<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader />
    <main class="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <slot />
    </main>
  </div>
</template>
