<script setup lang="ts">
/** Org page setup paused — posting will use the personal account for now. */
definePageMeta({ layout: 'home', access: 'protected' })

const localePath = useLocalePath()

await navigateTo(localePath('/settings'), { replace: true })
</script>

<template>
  <div />
</template>
