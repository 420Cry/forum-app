import { cva, type VariantProps } from 'class-variance-authority'

export const catalogAutocompleteInput = cva(
  [
    'bg-card',
    'border',
    'rounded-md',
    'py-2.5',
    'px-3',
    'text-ink',
    'text-sm',
    'w-full',
    'outline-none',
    'transition-colors',
    'placeholder:text-ink-4',
    'disabled:bg-surface-hover',
    'disabled:text-ink-2',
    'disabled:cursor-default',
  ],
  {
    variants: {
      intent: {
        primary: [
          'border-line',
          'focus:border-brand',
          'focus:ring-2',
          'focus:ring-brand/20',
        ],
        error: [
          'border-red-500',
          'focus:border-red-500',
          'focus:ring-2',
          'focus:ring-red-500/20',
        ],
      },
    },
  },
)

export type CatalogAutocompleteInputIntent = VariantProps<
  typeof catalogAutocompleteInput
>['intent']
