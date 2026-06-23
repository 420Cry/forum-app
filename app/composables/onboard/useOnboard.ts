import { shallowRef, ref, computed, reactive, readonly } from "vue";
import BasicInfo from "@/components/onboard/BasicInfo.vue";
import GoalSelection from "@/components/onboard/GoalSelection.vue";
import RoleSelection from "@/components/onboard/RoleSelection.vue";
import type {
  goalTitlesType,
  roleTitlesType,
} from "~/types/onboard/onboardType";
import { useZodValidation } from "../validate/useZodValidation";
import { Info } from "~/types/onboard/schema/infoSchema";

type onboardInfoType = {
  role: "" | roleTitlesType;
  goals: goalTitlesType[];
  firstName: string;
  lastName: string;
  age: string;
  location: string;
  occupation: string;
};

const onboardInfo = reactive<onboardInfoType>({
  role: "",
  goals: [],
  firstName: "",
  lastName: "",
  age: "",
  location: "",
  occupation: "",
});

const stepLabels: Record<number, string> = {
  1: "Choose your role",
  2: "Your goals",
  3: "About you",
};

const infoErrors = ref<Record<string, string> | null>(null);

export const useOnboard = () => {
  const onboardPage = shallowRef([
    { step: 1, pageName: RoleSelection, active: false },
    { step: 2, pageName: GoalSelection, active: false },
    { step: 3, pageName: BasicInfo, active: false },
  ]);

  const currentStep = ref(1);
  const isLoading = ref(false);

  const currentPage = computed(() => {
    const selectedPage = onboardPage.value.find((page) => page.active === true);
    return selectedPage?.pageName;
  });

  const currentStepLabel = computed(() => stepLabels[currentStep.value] ?? "");

  const updateOnboardPage = () => {
    onboardPage.value = onboardPage.value.map((onboardStep) => ({
      ...onboardStep,
      active: onboardStep.step === currentStep.value,
    }));
  };

  const toast = useToast();

  const bumpStep = () => {
    if (currentStep.value === onboardPage.value.length) {
      // TODO: submit onboardInfo and navigate to main app
      const submitInput = computed(() => {
        const { role, goals, ...rest } = onboardInfo;
        return rest;
      });
      const { formInputValidate } = useZodValidation();
      const { data, errors } = formInputValidate(submitInput.value, Info);
      if (errors) {
        infoErrors.value = errors;
        return;
      }
      infoErrors.value = null;
      // TODO: submit data to backend
      console.log("Valid info:", data);
      return;
    }

    if (currentStep.value === 1) {
      isLoading.value = true;
      if (!onboardInfo.role) {
        return toast.showError(
          "Please select your role before continue!",
          3000,
        );
      }
      // TODO: patch role to backend
    }

    if (currentStep.value === 2) {
      isLoading.value = true;
      if (onboardInfo.goals.length === 0) {
        return toast.showError(
          "Please select at least one goal before continue!",
          3000,
        );
      }
    }

    currentStep.value++;
    updateOnboardPage();
  };

  const clearInfoError = (field: string) => {
    if (!infoErrors.value) return;
    const { [field]: _, ...rest } = infoErrors.value;
    infoErrors.value = Object.keys(rest).length > 0 ? rest : null;
  };

  const backStep = () => {
    if (currentStep.value === 1) {
      // "Skip for now" — navigate away
      navigateTo("/");
      return;
    }
    currentStep.value--;
    updateOnboardPage();
  };

  return {
    currentPage,
    currentStep,
    currentStepLabel,
    onboardPage,
    bumpStep,
    backStep,
    updateOnboardPage,
    onboardInfo,
    infoErrors: readonly(infoErrors),
    clearInfoError,
  };
};
