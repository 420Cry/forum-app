import type { ZodObject } from "zod";

export const useZodValidation = () => {
  const formInputValidate = <TInput>(input: TInput, schema: ZodObject) => {
    const result = schema.safeParse(input);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      return { data: null, errors };
    }

    return { data: result.data as TInput, errors: null };
  };

  return { formInputValidate };
};
