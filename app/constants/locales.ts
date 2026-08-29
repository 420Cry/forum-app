export const LOCALE_CODES = ['en', 'vn'] as const

export type LocaleCode = (typeof LOCALE_CODES)[number]
