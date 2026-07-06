<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'

const emit = defineEmits(['next-page', 'back-page'])

const props = withDefaults(
  defineProps<{
    currentStep: number
    totalSteps: number
    loading?: boolean
  }>(),
  { loading: false },
)

const { t } = useI18n()
const isFirstStep = computed(() => props.currentStep === 1)
const isLastStep = computed(() => props.currentStep === props.totalSteps)
</script>

<template>
  <footer
    class="flex items-center justify-center border-t border-line bg-card px-8 py-[18px]"
  >
    <BaseButton
      v-if="!isFirstStep"
      intent="secondary"
      size="sm"
      :disabled="loading"
      @click="emit('back-page')"
    >
      <BaseIcon name="leftArrow" />
      {{ t('common.action.back') }}
    </BaseButton>

    <div class="flex w-full justify-end items-center gap-4">
      <span class="hidden text-[13px] text-ink-4 sm:block">
        {{ t('onboard.info.complete_each_step') }}
      </span>
      <BaseButton
        size="lg"
        :disabled="loading"
        @click="emit('next-page')"
      >
        {{
          isLastStep
            ? loading
              ? t('onboard.action.finishing')
              : t('onboard.action.finish')
            : t('common.action.continue')
        }}
        <BaseIcon
          name="rightArrow"
          size="1.2em"
        />
      </BaseButton>
    </div>
  </footer>
</template>
