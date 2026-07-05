import type { ZodObject, output } from 'zod'

export const useZodValidation = () => {
  const formInputValidate = <TSchema extends ZodObject>(
    input: unknown,
    schema: TSchema,
  ) => {
    const result = schema.safeParse(input)

    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (field && !errors[field]) {
          errors[field] = issue.message
        }
      }
      return { data: null, errors }
    }

    return { data: result.data as output<TSchema>, errors: null }
  }

  return { formInputValidate }
}
