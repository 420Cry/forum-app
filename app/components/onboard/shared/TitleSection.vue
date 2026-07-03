<script setup></script>
<template>
  <div class="mx-auto mb-10 max-w-[640px] text-center">
    <h1
      class="text-[26px] font-bold leading-[1.15] tracking-[-0.022em] text-ink md:text-[30px]"
    >
      <slot name="title" />
    </h1>
    <p
      class="mt-2.5 text-sm leading-[1.55] text-ink-3 md:text-[15.5px]"
    >
      <slot name="subtitle" />
    </p>
  </div>
</template>
