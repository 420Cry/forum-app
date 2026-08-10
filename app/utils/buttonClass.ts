import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Shared button styles — intents cover default / hover / active / focus / disabled.
 * Use with `<button>` or NuxtLink (`no-underline`).
 */
export const buttonClass = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-1.5',
    'font-semibold',
    'rounded-pill',
    'transition-colors',
    'duration-150',
    'cursor-pointer',
    'select-none',
    'whitespace-nowrap',
    'text-center',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-brand',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
    'disabled:shadow-none',
  ],
  {
    variants: {
      intent: {
        'primary': [
          'bg-brand',
          'text-white',
          'hover:bg-brand-hover',
          'active:bg-brand-active',
        ],
        'primary-outline': [
          'border',
          'border-brand',
          'text-brand',
          'bg-transparent',
          'hover:bg-brand-tint',
          'active:bg-brand-tint-strong',
        ],
        'secondary': [
          'border',
          'border-line',
          'text-ink-2',
          'bg-card',
          'hover:bg-surface-hover',
          'hover:border-line-2',
          'active:bg-surface-hover-2',
          'active:border-line-2',
        ],
        /** Filled muted — e.g. Following / selected toggle. */
        'soft': [
          'border',
          'border-transparent',
          'bg-surface-hover-2',
          'text-ink-2',
          'hover:bg-sand',
          'active:bg-line',
        ],
        'ghost': [
          'text-ink-3',
          'bg-transparent',
          'hover:bg-surface-hover',
          'hover:text-ink-2',
          'active:bg-surface-hover-2',
          'active:text-ink',
        ],
        'danger': [
          'bg-danger',
          'text-white',
          'hover:bg-danger-hover',
          'active:bg-danger-active',
          'focus-visible:outline-danger',
        ],
        'danger-outline': [
          'border',
          'border-danger',
          'text-danger',
          'bg-transparent',
          'hover:bg-danger-tint',
          'active:bg-danger-tint',
          'focus-visible:outline-danger',
        ],
      },
      size: {
        sm: ['px-3', 'py-1.5', 'text-[12.5px]', 'leading-none', 'min-h-8'],
        md: ['px-4', 'py-2', 'text-sm'],
        lg: ['px-5', 'py-2.5', 'text-sm'],
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      block: false,
    },
  },
)

export type ButtonIntent = NonNullable<VariantProps<typeof buttonClass>['intent']>
export type ButtonSize = NonNullable<VariantProps<typeof buttonClass>['size']>
