<script setup></script>
<template>
  <div>
    <h1 class="text-neutral-900 text-center text-xl font-bold mb-4 md:text-3xl">
      <slot name="title" />
    </h1>
    <h2 class="text-neutral-600 text-center text-xs font-medium md:text-sm">
      <slot name="subtitle" />
    </h2>
  </div>
</template>
