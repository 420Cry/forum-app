import { shallowRef, ref, computed, reactive, readonly } from "vue";
import BasicInfo from "@/components/onboard/BasicInfo.vue";
import GoalSelection from "@/components/onboard/GoalSelection.vue";
import RoleSelection from "@/components/onboard/RoleSelection.vue";
import type {
  goalTitlesType,
  roleTitlesType,
} from "~/types/onboard/onboardType";
import { useZodValidation } from "../validate/useZodValidation";
import { OnboardInfo } from "~/types/onboard/schema/onboardInfoSchema";
import { useOnboardApi } from "../api/onboard/useOnboardApi";
import { RolePayload } from "~/types/onboard/schema/rolePayloadSchema";
import type { ApiErrResponse } from "~/types/api";

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
  3: "Tell us about yourself",
};

const infoErrors = ref<Record<string, string> | null>(null);

const goalsRole = ref<"" | roleTitlesType>("");

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

  const currentStepLabel = computed(() => {
    if (currentStep.value === 2) {
      return onboardInfo.role === "Investor"
        ? "Your investor goals"
        : "Your founder goals";
    }
    return stepLabels[currentStep.value] ?? "";
  });

  const updateOnboardPage = () => {
    onboardPage.value = onboardPage.value.map((onboardStep) => ({
      ...onboardStep,
      active: onboardStep.step === currentStep.value,
    }));
  };

  const toast = useToast();

  const bumpStep = async () => {
    const { formInputValidate } = useZodValidation();
    if (currentStep.value === onboardPage.value.length) {
      isLoading.value = true;
      const { saveUserInfo } = useOnboardApi();
      const submitInput = computed(() => {
        const { role, goals, ...rest } = onboardInfo;
        return rest;
      });
      try {
        const { data, errors } = formInputValidate(
          submitInput.value,
          OnboardInfo,
        );
        if (errors) {
          infoErrors.value = errors;
          return;
        }
        infoErrors.value = null;
        const res = await saveUserInfo(data);
        if (!res.success) {
          return toast.showError("Please try again later", 1500);
        }
        toast.showSuccess(res.message, 2000);
        return await navigateTo("/home");
      } catch (err: unknown) {
        const error = (err as { data?: ApiErrResponse })?.data;
        if (!error) return toast.showError("Please try again", 2000);

        if (typeof error.message === "string") {
          return toast.showError(error.message, 2000);
        }

        if (Array.isArray(error.message)) {
          error.message.forEach((msg) => {
            toast.showError(msg, 1500);
          });
          return;
        }
      } finally {
        isLoading.value = false;
      }
      return;
    }

    if (currentStep.value === 1) {
      isLoading.value = true;
      const { saveUserRole } = useOnboardApi();
      if (!onboardInfo.role) {
        isLoading.value = false;
        return toast.showError(
          "Please select your role before continue!",
          3000,
        );
      }
      try {
        const { data, errors } = formInputValidate(
          { role: onboardInfo.role },
          RolePayload,
        );
        if (errors) {
          return toast.showError(Object.values(errors)[0] as string, 3000);
        }

        const res = await saveUserRole(data);
        toast.showSuccess(res.message, 1500);
      } catch (err: unknown) {
        const error = (err as { data?: ApiErrResponse })?.data;
        if (!error) return toast.showError("Please try again", 2000);

        if (typeof error.message === "string") {
          return toast.showError(error.message, 2000);
        }

        if (Array.isArray(error.message)) {
          error.message.forEach((msg) => {
            toast.showError(msg, 1500);
          });
          return;
        }
      } finally {
        isLoading.value = false;
      }
    }

    if (currentStep.value === 2) {
      isLoading.value = true;
      if (onboardInfo.goals.length === 0) {
        isLoading.value = false;
        return toast.showError(
          "Please select at least one goal before continue!",
          3000,
        );
      }
      const { saveUserGoals } = useOnboardApi();
      try {
        const res = await saveUserGoals(onboardInfo.goals);
        toast.showSuccess(res.message, 1500);
      } catch (err: unknown) {
        const error = (err as { data?: ApiErrResponse })?.data;
        if (!error) return toast.showError("Please try again", 2000);

        if (typeof error.message === "string") {
          return toast.showError(error.message, 2000);
        }

        if (Array.isArray(error.message)) {
          error.message.forEach((msg) => {
            toast.showError(msg, 1500);
          });
        }
        return;
      } finally {
        isLoading.value = false;
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
    goalsRole,
    isLoading,
    infoErrors: readonly(infoErrors),
    clearInfoError,
  };
};
