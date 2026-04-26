import { describe, it, expect } from 'vitest'
import { scrubPII, sanitizeForPrompt, scrubBase64ForLogging } from '@/lib/security/privacy'
import { exportUserData, deleteUserData, anonymizeUserData } from '@/lib/security/gdpr'

describe('Security & Privacy', () => {
  describe('PII scrubbing', () => {
    it('redacts email addresses', () => {
      const text = 'Contact me at david@example.com for details'
      const result = scrubPII(text)
      expect(result.text).not.toContain('david@example.com')
      expect(result.scrubbed).toBe(true)
      expect(result.fields).toContain('email')
    })

    it('redacts phone numbers', () => {
      const text = 'Call me at +1-555-123-4567'
      const result = scrubPII(text)
      expect(result.text).not.toContain('555-123-4567')
      expect(result.scrubbed).toBe(true)
      expect(result.fields).toContain('phone')
    })

    it('redacts credit card numbers', () => {
      const text = 'Card: 4111 1111 1111 1111'
      const result = scrubPII(text)
      expect(result.text).not.toContain('4111')
      expect(result.scrubbed).toBe(true)
      expect(result.fields).toContain('credit_card')
    })

    it('leaves safe text intact', () => {
      const text = 'I love the colour coral in this palette'
      const result = scrubPII(text)
      expect(result.text).toBe(text)
      expect(result.scrubbed).toBe(false)
      expect(result.fields).toEqual([])
    })
  })

  describe('Prompt sanitization', () => {
    it('removes script tags', () => {
      const text = '<script>alert("xss")</script>'
      expect(sanitizeForPrompt(text)).not.toContain('<script>')
    })

    it('removes javascript URIs', () => {
      const text = 'javascript:void(0)'
      expect(sanitizeForPrompt(text)).not.toContain('javascript:')
    })
  })

  describe('Base64 logging scrub', () => {
    it('truncates long base64 strings', () => {
      const longB64 = 'data:image/jpeg;base64,' + 'A'.repeat(5000)
      const result = scrubBase64ForLogging(longB64)
      expect(result.length).toBeLessThan(longB64.length)
      expect(result).toContain('[REDACTED]')
    })
  })

  describe('GDPR helpers', () => {
    const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

    it.skipIf(!hasSupabase)('exportUserData returns structured object', async () => {
      const data = await exportUserData('test-user-123')
      expect(data).toHaveProperty('userId')
      expect(data).toHaveProperty('outfits')
      expect(data).toHaveProperty('feedback')
      expect(data).toHaveProperty('entitlements')
    })

    it.skipIf(!hasSupabase)('deleteUserData handles missing user gracefully', async () => {
      const result = await deleteUserData('nonexistent-user')
      expect(result).toHaveProperty('deleted')
    })

    it.skipIf(!hasSupabase)('anonymizeUserData replaces PII', async () => {
      const result = await anonymizeUserData('test-user-123')
      expect(result).toHaveProperty('anonymized')
    })

    it('GDPR endpoints exist conceptually when Supabase is absent', () => {
      expect(typeof exportUserData).toBe('function')
      expect(typeof deleteUserData).toBe('function')
      expect(typeof anonymizeUserData).toBe('function')
    })
  })
})
