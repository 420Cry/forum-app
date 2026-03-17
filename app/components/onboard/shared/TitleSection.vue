<script setup></script>
<template>
  <div>
    <h1 class="text-neutral-900 text-center text-xl font-bold mb-4 md:text-3xl">
      <slot name="title" />
    </h1>
    <div class="flex justify-center">
      <h2
        class="text-neutral-600 max-w-full text-center text-xs leading-6 font-medium md:text-sm"
      >
        <slot name="subtitle" />
      </h2>
    </div>
  </div>
</template>
