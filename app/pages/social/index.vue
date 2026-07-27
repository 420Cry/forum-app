<script setup lang="ts">
import NewsFeed from '~/components/home/social/newsFeed/NewsFeed.vue'

definePageMeta({ layout: 'home', access: 'protected' })
</script>

<template>
  <div class="flex flex-col gap-3">
    <NewsFeed />
  </div>
</template>
