<script setup lang="ts">
import ProfileCard from './leftRail/ProfileCard.vue'
import NavigationTabs from './leftRail/NavigationTabs.vue'
import MembershipCallout from './leftRail/MembershipCallout.vue'
</script>

<template>
  <div class="flex flex-col gap-3">
    <ProfileCard />
    <NavigationTabs />
    <MembershipCallout />
  </div>
</template>
