<script setup lang="ts">
import BaseButton from "~/components/shared/BaseButton.vue";
import BaseIcon from "~/components/shared/BaseIcon.vue";

const emit = defineEmits(["next-page", "back-page"]);

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const isFirstStep = computed(() => props.currentStep === 1);
const isLastStep = computed(() => props.currentStep === props.totalSteps);
</script>

<template>
  <div class="mt-16 flex justify-between items-center">
    <BaseButton
      :intent="isFirstStep ? 'ghost' : 'secondary'"
      size="sm"
      @click="emit('back-page')"
    >
      <BaseIcon v-if="!isFirstStep" name="leftArrow" />
      {{ isFirstStep ? "Skip for now" : "Back" }}
    </BaseButton>

    <span class="hidden sm:block text-xs text-ink-4">
      You can change any of this later in Settings
    </span>

    <BaseButton size="sm" @click="emit('next-page')">
      {{ isLastStep ? "Finish & enter Fundedr" : "Continue" }}
      <BaseIcon name="rightArrow" size="1.2em" />
    </BaseButton>
  </div>
</template>
