// PII scrubbing utilities — strip sensitive data before sending to external APIs

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g
const SSN_REGEX = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g
const ADDRESS_REGEX = /\d+\s+([a-zA-Z]+\s*){1,5},?\s*[a-zA-Z]*\s*,?\s*[a-zA-Z]{2}\s*\d{5}/g

export interface ScrubResult {
  text: string
  scrubbed: boolean
  fields: string[]
}

export function scrubPII(text: string): ScrubResult {
  let scrubbed = false
  const fields: string[] = []

  let result = text

  if (EMAIL_REGEX.test(result)) {
    result = result.replace(EMAIL_REGEX, '[EMAIL_REDACTED]')
    scrubbed = true
    fields.push('email')
  }
  if (PHONE_REGEX.test(result)) {
    result = result.replace(PHONE_REGEX, '[PHONE_REDACTED]')
    scrubbed = true
    fields.push('phone')
  }
  if (CREDIT_CARD_REGEX.test(result)) {
    result = result.replace(CREDIT_CARD_REGEX, '[CARD_REDACTED]')
    scrubbed = true
    fields.push('credit_card')
  }
  if (SSN_REGEX.test(result)) {
    result = result.replace(SSN_REGEX, '[SSN_REDACTED]')
    scrubbed = true
    fields.push('ssn')
  }
  if (ADDRESS_REGEX.test(result)) {
    result = result.replace(ADDRESS_REGEX, '[ADDRESS_REDACTED]')
    scrubbed = true
    fields.push('address')
  }

  return { text: result, scrubbed, fields }
}

export function scrubBase64ForLogging(base64: string): string {
  // Only log first 20 chars of base64 to avoid leaking full images in logs
  if (base64.length > 50) {
    return base64.substring(0, 20) + '...[REDACTED]'
  }
  return base64
}

export function sanitizeForPrompt(text: string): string {
  // Remove anything that looks like an injection attempt
  return text
    .replace(/<script>/gi, '[REMOVED]')
    .replace(/javascript:/gi, '[REMOVED]')
    .replace(/on\w+=/gi, '[REMOVED]')
    .replace(/--/g, '[REMOVED]')
    .replace(/;/g, ' ')
}

// Data retention: mark images for deletion after 30 days
export const IMAGE_RETENTION_DAYS = 30
export const ANALYSIS_RETENTION_DAYS = 365

export function shouldDeleteImage(createdAt: string): boolean {
  const created = new Date(createdAt)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - IMAGE_RETENTION_DAYS)
  return created < cutoff
}
