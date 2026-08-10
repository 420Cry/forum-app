<script setup lang="ts">
import FindFacetAccordion from '~/components/directory/FindFacetAccordion.vue'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseDrawer from '~/components/shared/BaseDrawer.vue'
import { startupStages } from '~/types/profile'

const open = defineModel<boolean>('open', { default: false })

const draftLocation = defineModel<string[]>('location', { required: true })
const draftOccupation = defineModel<string[]>('occupation', { required: true })
const draftRole = defineModel<string[]>('role', { required: true })
const draftIndustry = defineModel<string[]>('industry', { required: true })
const draftStage = defineModel<string[]>('stage', { required: true })

defineProps<{
  locationOptions: { value: string, label: string }[]
  occupationOptions: { value: string, label: string }[]
  industryOptions: { value: string, label: string }[]
  roleOptions: { value: string, label: string }[]
  showPeopleFilters: boolean
  showOrgFilters: boolean
  showStageFilter: boolean
}>()

const emit = defineEmits<{
  apply: []
  clear: []
}>()

const { t } = useI18n()

const stageOptions = computed(() =>
  startupStages.map(s => ({
    value: s,
    label: t(`profiles.stage.${s}`),
  })),
)

const hasDraft = computed(
  () =>
    draftLocation.value.length > 0
    || draftOccupation.value.length > 0
    || draftRole.value.length > 0
    || draftIndustry.value.length > 0
    || draftStage.value.length > 0,
)

function onClear() {
  draftLocation.value = []
  draftOccupation.value = []
  draftRole.value = []
  draftIndustry.value = []
  draftStage.value = []
  emit('clear')
}

function onApply() {
  emit('apply')
  open.value = false
}
</script>

<template>
  <BaseDrawer
    v-model:open="open"
    :title="t('find.action.filters')"
  >
    <p
      v-if="!showPeopleFilters && !showOrgFilters"
      class="py-6 text-sm text-ink-3"
    >
      {{ t('find.info.filters_empty') }}
    </p>

    <FindFacetAccordion
      v-if="showPeopleFilters"
      v-model="draftLocation"
      :title="t('find.filter.location')"
      :options="locationOptions"
      :any-label="t('find.filter.any')"
      default-open
    />
    <FindFacetAccordion
      v-if="showPeopleFilters"
      v-model="draftOccupation"
      :title="t('find.filter.occupation')"
      :options="occupationOptions"
      :any-label="t('find.filter.any')"
    />
    <FindFacetAccordion
      v-if="showPeopleFilters"
      v-model="draftRole"
      :title="t('find.filter.role')"
      :options="roleOptions"
      :any-label="t('find.filter.any')"
    />
    <FindFacetAccordion
      v-if="showOrgFilters"
      v-model="draftIndustry"
      :title="t('find.filter.industry')"
      :options="industryOptions"
      :any-label="t('find.filter.any')"
      :default-open="!showPeopleFilters"
    />
    <FindFacetAccordion
      v-if="showStageFilter"
      v-model="draftStage"
      :title="t('find.filter.stage')"
      :options="stageOptions"
      :any-label="t('find.filter.any')"
    />

    <template #footer>
      <div class="flex gap-2">
        <BaseButton
          intent="secondary"
          size="md"
          class="flex-1"
          :disabled="!hasDraft"
          @click="onClear"
        >
          {{ t('find.action.clear') }}
        </BaseButton>
        <BaseButton
          intent="primary"
          size="md"
          class="flex-1"
          @click="onApply"
        >
          {{ t('find.action.show_results') }}
        </BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>
