<script setup lang="ts">
import SuggestedFollows from './rightRail/SuggestedFollows.vue'
import TrendingNow from './rightRail/TrendingNow.vue'
</script>

<template>
  <!-- right rail content -->
  <div class="flex flex-col gap-3">
    <SuggestedFollows />
    <TrendingNow />
  </div>
</template>
