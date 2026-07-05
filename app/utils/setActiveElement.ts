import type { Ref } from 'vue'

const setElementActive = <TElement extends { active: boolean }>(
  activeElement: TElement,
  originalArray: Ref<TElement[]>,
) => {
  originalArray.value = originalArray.value.map((element) => {
    return { ...element, active: element === activeElement }
  })
}

export default setElementActive
