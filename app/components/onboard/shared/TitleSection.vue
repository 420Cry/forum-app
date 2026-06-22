<script setup></script>
<template>
  <div>
    <h1 class="text-ink text-center text-xl font-bold mb-4 md:text-3xl">
      <slot name="title" />
    </h1>
    <div class="flex justify-center">
      <h2
        class="text-ink-3 max-w-full text-center text-xs leading-6 font-medium md:text-sm"
      >
        <slot name="subtitle" />
      </h2>
    </div>
  </div>
</template>
