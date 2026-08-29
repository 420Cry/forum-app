<script setup lang="ts">
definePageMeta({ layout: 'auth', access: 'guest' })

const localePath = useLocalePath()

await navigateTo(localePath('/auth/login'), { replace: true })
</script>

<template>
  <div />
</template>
