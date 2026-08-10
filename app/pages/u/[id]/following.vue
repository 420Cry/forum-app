<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'public' })

const route = useRoute()
const localePath = useLocalePath()
const id = computed(() => String(route.params.id ?? ''))

await navigateTo(
  {
    path: localePath(`/u/${id.value}`),
    query: { list: 'following' },
  },
  { replace: true },
)
</script>

<template>
  <div />
</template>
