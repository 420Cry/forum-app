import { LOCALE_CODES } from '~/constants/locales'

/** Strip `/en` or `/vn` prefix from a localized route path. */
export function stripLocalePrefix(path: string): string {
  for (const code of LOCALE_CODES) {
    if (path === `/${code}`) return '/'
    if (path.startsWith(`/${code}/`)) {
      return path.slice(code.length + 1) || '/'
    }
  }
  return path
}
