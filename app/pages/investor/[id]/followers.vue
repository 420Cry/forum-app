<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'public' })

const route = useRoute()
const localePath = useLocalePath()
const id = computed(() => String(route.params.id ?? ''))

await navigateTo(
  {
    path: localePath(`/investor/${id.value}`),
    query: { list: 'followers' },
  },
  { replace: true },
)
</script>

<template>
  <div />
</template>
