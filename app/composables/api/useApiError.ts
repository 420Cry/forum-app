import type { ApiErrResponse } from '~/types/api'

/** Toast the message(s) of a forum-api error response, falling back to a generic retry toast. */
export const useApiError = () => {
  const { t } = useI18n()
  const toast = useToast()

  const showApiError = (err: unknown) => {
    const error = (err as { data?: ApiErrResponse })?.data
    if (!error) return toast.showError(t('common.error.try_again'), 2000)
    if (typeof error.message === 'string') {
      return toast.showError(error.message, 2000)
    }
    if (Array.isArray(error.message)) {
      error.message.forEach(msg => toast.showError(msg, 1500))
    }
  }

  return { showApiError }
}
