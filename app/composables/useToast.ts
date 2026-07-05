export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

let nextId = 0
const DEFAULT_DURATION = 5000

export function useToast() {
  const toasts = useState<Toast[]>('app-toasts', () => [])

  function add(message: string, type: ToastType, duration = DEFAULT_DURATION) {
    const id = ++nextId
    toasts.value = [...toasts.value, { id, message, type }]
    if (duration > 0) {
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, duration)
    }
  }

  function showSuccess(message: string, duration = DEFAULT_DURATION) {
    add(message, 'success', duration)
  }

  function showError(message: string, duration = DEFAULT_DURATION) {
    add(message, 'error', duration)
  }

  function showInfo(message: string, duration = DEFAULT_DURATION) {
    add(message, 'info', duration)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, showSuccess, showError, showInfo, remove }
}
