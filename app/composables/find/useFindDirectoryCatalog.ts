import { useCatalogApi } from '~/composables/api/useCatalogApi'
import { useOccupationLabels } from '~/composables/catalog/useOccupationLabels'
import type { FindOption } from '~/types/find'
import { locationCatalogLabel } from '~/utils/catalogLabel'

export function useFindDirectoryCatalog() {
  const { t, te, locale } = useI18n()
  const { fetchTags } = useCatalogApi()
  const { ensureLoaded, label: occupationLabel } = useOccupationLabels()

  const locationOptions = ref<FindOption[]>([])
  const occupationOptions = ref<FindOption[]>([])
  const industryOptions = ref<FindOption[]>([])

  async function loadCatalogOptions() {
    const [locations, occupations, industries] = await Promise.all([
      fetchTags('location').catch(() => []),
      fetchTags('occupation').catch(() => []),
      fetchTags('industry').catch(() => []),
      ensureLoaded().catch(() => undefined),
    ])
    locationOptions.value = locations.map(tag => ({
      value: tag.key,
      label: locationCatalogLabel(tag.key, tag.name, t, te),
    }))
    occupationOptions.value = occupations.map(tag => ({
      value: tag.key,
      label: occupationLabel(tag.key, tag.name),
    }))
    industryOptions.value = industries.map(tag => ({
      value: tag.key,
      label: tag.name,
    }))
  }

  watch(locale, async () => {
    await ensureLoaded().catch(() => undefined)
    occupationOptions.value = occupationOptions.value.map(opt => ({
      value: opt.value,
      label: occupationLabel(opt.value, opt.label),
    }))
    locationOptions.value = locationOptions.value.map(opt => ({
      value: opt.value,
      label: locationCatalogLabel(opt.value, opt.label, t, te),
    }))
  })

  return {
    locationOptions,
    occupationOptions,
    industryOptions,
    occupationLabel,
    loadCatalogOptions,
  }
}
