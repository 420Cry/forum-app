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
  <footer
    class="flex items-center justify-center border-t border-line bg-card px-8 py-[18px]"
  >
    <BaseButton
      v-if="!isFirstStep"
      intent="secondary"
      size="sm"
      @click="emit('back-page')"
    >
      <BaseIcon name="leftArrow" />
      Back
    </BaseButton>

    <div class="flex w-full justify-end items-center gap-4">
      <span class="hidden text-[13px] text-ink-4 sm:block">
        You can change any of this later in Settings
      </span>
      <BaseButton size="lg" @click="emit('next-page')">
        {{ isLastStep ? "Finish & enter Fundedr" : "Continue" }}
        <BaseIcon name="rightArrow" size="1.2em" />
      </BaseButton>
    </div>
  </footer>
</template>
