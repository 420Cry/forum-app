import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = join(import.meta.dirname, '..')
const LOCALES_DIR = join(ROOT, 'locales')

function flattenMessages(
  obj: Record<string, unknown>,
  prefix = '',
): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenMessages(value as Record<string, unknown>, path))
    }
    else {
      keys.push(path)
    }
  }
  return keys.sort()
}

function readLocale(code: 'en' | 'vn') {
  const raw = readFileSync(
    join(LOCALES_DIR, code, 'forum-common.json'),
    'utf8',
  )
  return flattenMessages(JSON.parse(raw) as Record<string, unknown>)
}

function collectSourceFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      if (entry === 'node_modules' || entry === '.output') continue
      files.push(...collectSourceFiles(path))
    }
    else if (/\.(vue|ts)$/.test(entry)) {
      files.push(path)
    }
  }
  return files
}

function collectTranslationKeysFromCode(): string[] {
  const keys = new Set<string>()
  const keyRe = /\bt\(\s*['"]((?:auth|common|onboard|settings|find|following|profiles|social)\.[a-z0-9_.]+)['"]/g

  for (const file of collectSourceFiles(join(ROOT, 'app'))) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(keyRe)) {
      keys.add(match[1]!)
    }
  }

  const authErrorsSource = readFileSync(
    join(ROOT, 'app/utils/authErrors.ts'),
    'utf8',
  )
  for (const match of authErrorsSource.matchAll(
    /'((?:auth|common)\.[a-z0-9_.]+)'/g,
  )) {
    keys.add(match[1]!)
  }

  return [...keys].sort()
}

describe('locale parity', () => {
  const enKeys = readLocale('en')
  const vnKeys = readLocale('vn')
  const enSet = new Set(enKeys)
  const vnSet = new Set(vnKeys)

  it('keeps en and vn key sets identical', () => {
    const missingInVn = enKeys.filter(key => !vnSet.has(key))
    const missingInEn = vnKeys.filter(key => !enSet.has(key))

    expect(missingInVn, `missing in vn: ${missingInVn.join(', ')}`).toEqual([])
    expect(missingInEn, `missing in en: ${missingInEn.join(', ')}`).toEqual([])
  })

  it('includes auth.error.link_expired in both locales', () => {
    expect(enSet.has('auth.error.link_expired')).toBe(true)
    expect(vnSet.has('auth.error.link_expired')).toBe(true)
  })

  it('defines every translation key used in app code', () => {
    const usedKeys = collectTranslationKeysFromCode()
    const missing = usedKeys.filter(key => !enSet.has(key))

    expect(missing, `missing in en: ${missing.join(', ')}`).toEqual([])
  })
})
