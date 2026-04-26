const fs = require('fs');
const path = require('path');
const { scrubPII, sanitizeForPrompt, scrubBase64ForLogging } = require('../src/lib/security/privacy');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: rateLimit.ts exists and exports limiters
const rateLimitPath = path.join(__dirname, '../src/lib/security/rateLimit.ts');
if (fs.existsSync(rateLimitPath)) {
  const content = fs.readFileSync(rateLimitPath, 'utf8');
  (content.includes('generalLimit')) ? pass('rateLimit:generalLimit') : fail('rateLimit:generalLimit');
  (content.includes('analysisLimit')) ? pass('rateLimit:analysisLimit') : fail('rateLimit:analysisLimit');
  (content.includes('tryonLimit')) ? pass('rateLimit:tryonLimit') : fail('rateLimit:tryonLimit');
  (content.includes('advisorLimit')) ? pass('rateLimit:advisorLimit') : fail('rateLimit:advisorLimit');
  (content.includes('getClientIP')) ? pass('rateLimit:getClientIP') : fail('rateLimit:getClientIP');
} else {
  fail('rateLimit:file');
}

// Check 2: privacy.ts PII scrubbing
const scrubResult = scrubPII('Contact me at david@example.com or call 555-123-4567');
(scrubResult.scrubbed && scrubResult.fields.includes('email') && scrubResult.fields.includes('phone'))
  ? pass('privacy:scrubPII')
  : fail('privacy:scrubPII');

const cardScrub = scrubPII('My card is 4111 1111 1111 1111');
(cardScrub.scrubbed && cardScrub.fields.includes('credit_card')) ? pass('privacy:scrubCard') : fail('privacy:scrubCard');

// Check 3: sanitizeForPrompt
const sanitized = sanitizeForPrompt('<script>alert(1)</script>');
(sanitized.includes('[REMOVED]') && !sanitized.includes('<script>')) ? pass('privacy:sanitize') : fail('privacy:sanitize');

// Check 4: scrubBase64ForLogging
const redacted = scrubBase64ForLogging('a'.repeat(100));
(redacted.includes('[REDACTED]') && redacted.length < 100) ? pass('privacy:base64-redact') : fail('privacy:base64-redact');

// Check 5: gdpr.ts exists and exports functions
const gdprPath = path.join(__dirname, '../src/lib/security/gdpr.ts');
if (fs.existsSync(gdprPath)) {
  const content = fs.readFileSync(gdprPath, 'utf8');
  (content.includes('exportUserData')) ? pass('gdpr:exportUserData') : fail('gdpr:exportUserData');
  (content.includes('deleteUserData')) ? pass('gdpr:deleteUserData') : fail('gdpr:deleteUserData');
  (content.includes('anonymizeUserData')) ? pass('gdpr:anonymizeUserData') : fail('gdpr:anonymizeUserData');
} else {
  fail('gdpr:file');
}

// Check 6: GDPR API routes exist
const exportRoute = path.join(__dirname, '../src/app/api/gdpr/export/route.ts');
const deleteRoute = path.join(__dirname, '../src/app/api/gdpr/delete/route.ts');
if (fs.existsSync(exportRoute)) {
  pass('api:gdpr-export');
} else {
  fail('api:gdpr-export');
}
if (fs.existsSync(deleteRoute)) {
  pass('api:gdpr-delete');
} else {
  fail('api:gdpr-delete');
}

// Check 7: middleware updated with rate limiting and security headers
const middlewarePath = path.join(__dirname, '../src/middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const content = fs.readFileSync(middlewarePath, 'utf8');
  (content.includes('checkRateLimit')) ? pass('middleware:rateLimit') : fail('middleware:rateLimit');
  (content.includes('X-Content-Type-Options')) ? pass('middleware:security-headers') : fail('middleware:security-headers');
  (content.includes('Permissions-Policy')) ? pass('middleware:permissions-policy') : fail('middleware:permissions-policy');
  (content.includes('429')) ? pass('middleware:rate-limit-status') : fail('middleware:rate-limit-status');
} else {
  fail('middleware:file');
}

// Check 8: data retention constants
const privacyPath = path.join(__dirname, '../src/lib/security/privacy.ts');
if (fs.existsSync(privacyPath)) {
  const content = fs.readFileSync(privacyPath, 'utf8');
  (content.includes('IMAGE_RETENTION_DAYS')) ? pass('privacy:retention-constant') : fail('privacy:retention-constant');
  (content.includes('shouldDeleteImage')) ? pass('privacy:retention-function') : fail('privacy:retention-function');
} else {
  fail('privacy:file');
}

console.log(`\nSECURITY_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
