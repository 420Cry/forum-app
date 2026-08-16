import { describe, expect, it } from 'vitest'
import {
  connectSrcDirective,
  securityHeaders,
} from '../config/securityHeaders'

const prod = {
  apiOrigins: ['https://api.forum.app', 'https://xyz.supabase.co'],
  dev: false,
}

describe('connectSrcDirective', () => {
  it('adds each origin plus its websocket scheme', () => {
    const directive = connectSrcDirective(prod)
    expect(directive).toContain('https://api.forum.app')
    expect(directive).toContain('wss://xyz.supabase.co')
  })

  it('keeps plain http/ws out of non-dev builds', () => {
    const directive = connectSrcDirective(prod)
    expect(directive).not.toMatch(/(^| )http:( |$)/)
    expect(directive).not.toMatch(/(^| )ws:( |$)/)
  })

  it('allows the local http stack only in dev', () => {
    const directive = connectSrcDirective({
      apiOrigins: ['http://api.forum.test'],
      dev: true,
    })
    expect(directive).toContain(' http:')
    expect(directive).toContain(' ws:')
    expect(directive).toContain('ws://api.forum.test')
  })

  it('ignores unparseable env values', () => {
    expect(() =>
      connectSrcDirective({ apiOrigins: ['', 'not a url'], dev: false }),
    ).not.toThrow()
  })
})

describe('securityHeaders', () => {
  it('ships the hardening baseline', () => {
    const headers = securityHeaders(prod)
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Content-Security-Policy']).toContain(
      'frame-ancestors \'none\'',
    )
    expect(headers['Content-Security-Policy']).toContain('object-src \'none\'')
  })
})
