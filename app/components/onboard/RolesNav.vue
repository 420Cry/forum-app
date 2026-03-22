<script setup lang="ts">
const props = defineProps<{ active: boolean }>();
defineEmits(["roleClick"]);

const roleClass = computed(() => {
  return [
    "text-xs px-4 py-2 font-semibold rounded-lg hover:bg-neutral-100 hover:text-primary-900 md:text-sm",
    {
      "bg-neutral-100 text-primary-900": props.active,
    },
  ];
});
</script>

<template>
  <button :class="roleClass" @click="$emit('roleClick')">
    <slot />
  </button>
</template>
