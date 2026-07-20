<script setup lang="ts">
import { useNavigationLinks } from '~/constants/navigationLink'
import BaseIcon from './BaseIcon.vue'

const navigationLinks = useNavigationLinks()
</script>

<template>
  <div class="w-full bg-white flex flex-col p-1">
    <div
      v-for="link in navigationLinks"
      :key="link.id"
      class="px-4 py-2 flex gap-3"
    >
      <BaseIcon
        :name="link.iconName"
        size="1.5em"
        class="text-brand"
      />
    </div>
  </div>
</template>
