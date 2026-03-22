// TODO: Move to useOnboard composables
import { shallowRef, ref, computed } from "vue";
import BasicInfo from "@/components/onboard/BasicInfo.vue";
import GoalSelection from "@/components/onboard/GoalSelection.vue";
import RoleSelection from "@/components/onboard/RoleSelection.vue";
import type {
  goalTitlesType,
  roleTitlesType,
} from "~/types/onboard/onboardType";

type onboardInfoType = {
  role: "" | roleTitlesType;
  goals: goalTitlesType[];
  fullname: string;
  dob: string;
  occupation: string;
};

const onboardInfo = reactive<onboardInfoType>({
  role: "",
  goals: [],
  fullname: "",
  dob: "",
  occupation: "",
});

export const useOnboard = () => {
  const onboardPage = shallowRef([
    {
      step: 1,
      pageName: RoleSelection,
      active: false,
    },
    {
      step: 2,
      pageName: GoalSelection,
      active: false,
    },
    {
      step: 3,
      pageName: BasicInfo,
      active: false,
    },
  ]);

  const currentStep = ref(1);

  const currentPage = computed(() => {
    const selectedPage = onboardPage.value.find((page) => page.active === true);
    return selectedPage?.pageName;
  });

  const updateOnboardPage = () => {
    const newTotalSteps = onboardPage.value.map((onboardStep) => {
      return onboardStep.step === currentStep.value
        ? { ...onboardStep, active: true }
        : { ...onboardStep, active: false };
    });
    onboardPage.value = newTotalSteps;
  };

  const bumpStep = () => {
    if (currentStep.value === onboardPage.value.length) {
      // TODO: Move to setup profile poge
      return;
    }
    currentStep.value++;
    updateOnboardPage();
  };

  const backStep = () => {
    if (currentStep.value === 1) {
      //TODO: Skip for now
      currentStep.value++;
      updateOnboardPage();
      return;
    }
    currentStep.value--;
    updateOnboardPage();
  };

  return {
    currentPage,
    onboardPage,
    bumpStep,
    backStep,
    updateOnboardPage,
    onboardInfo,
  };
};
