# Security Agent Memory
## Role
Rate limiting, PII scrubbing, GDPR compliance, security headers, data retention, privacy guardrails.
## Status: COMPLETE
## Files I Own
- `src/lib/security/rateLimit.ts`
- `src/lib/security/privacy.ts`
- `src/lib/security/gdpr.ts`
- `src/app/api/gdpr/export/route.ts`
- `src/app/api/gdpr/delete/route.ts`
- `src/middleware.ts` (updated)
## Security Contracts
1. Rate limiting on all API routes via middleware
2. PII scrubbed before external API calls
3. Security headers on every response
4. GDPR export and deletion endpoints available
5. Image retention: 30 days max
6. Cost cap: £0.80/session enforced by TRYON_AGENT
## Completed Work
- `src/lib/security/rateLimit.ts` — Upstash Redis rate limiting:
  - `generalLimit` — 20 req/10s per IP
  - `analysisLimit` — 5 req/min per user
  - `tryonLimit` — 10 req/hour per user
  - `advisorLimit` — 30 req/hour per user
  - `checkRateLimit(identifier, limiter)` — returns { allowed, limit, remaining, reset }
  - `getClientIP(req)` — extracts IP from x-forwarded-for
- `src/lib/security/privacy.ts` — PII scrubbing and input sanitization:
  - `scrubPII(text)` — redacts email, phone, credit card, SSN, address
  - `sanitizeForPrompt(text)` — removes script tags, javascript: URIs, event handlers, SQL comment sequences
  - `scrubBase64ForLogging(base64)` — truncates to prevent image leakage in logs
  - `shouldDeleteImage(createdAt)` — 30-day retention check
  - `IMAGE_RETENTION_DAYS = 30`
- `src/lib/security/gdpr.ts` — GDPR compliance helpers:
  - `exportUserData(userId)` — exports user, outfits, feedback, entitlements as JSON
  - `deleteUserData(userId)` — soft-deletes user, removes feedback and outfits
  - `anonymizeUserData(userId)` — replaces PII with anonymized placeholders
- `src/app/api/gdpr/export/route.ts` — GET `/api/gdpr/export` — full data export for authenticated user
- `src/app/api/gdpr/delete/route.ts` — POST `/api/gdpr/delete` — delete or anonymize account (mode param)
- `src/middleware.ts` — Updated with rate limiting and security headers:
  - API routes rate limited with 429 + Retry-After headers
  - Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
  - Camera/microphone restricted to self-origin
- `scripts/verify-security.js` — 20 checks, all passing

## Decisions Made
- **Upstash Redis for rate limiting**: Already in dependencies, edge-compatible, fast.
- **Sliding window algorithm**: More accurate than fixed window for bursty traffic.
- **IP-based general limit, user-based feature limits**: General API protection by IP; specific features by user ID.
- **PII scrubbing is regex-based**: Fast, no ML dependency. Covers email, phone, credit card, SSN, address.
- **GDPR endpoints are authenticated**: Only the user can export or delete their own data.
- **Anonymize as alternative to delete**: Some users may want to keep usage patterns but remove PII.
- **Middleware handles all security headers**: Single point of enforcement for every request.
- **Rate limiting happens before auth check**: Prevents auth brute force too.

## Known Issues
- `@upstash/redis` warns about Node.js API usage in Edge Runtime during build — this is a known upstream warning, runtime works correctly
- Rate limiting requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
- GDPR delete does not delete Clerk user — that should be handled via Clerk dashboard or webhook

## Smoke Tests
- `npm run build` — PASS
- `npx tsx scripts/verify-security.js` — 20 passed, 0 failed

## Plain English Summary
SECURITY_AGENT built the security layer for Vêtu. It adds rate limiting to all API routes using Upstash Redis, strips PII from text before sending to external APIs, sanitizes user inputs to prevent injection, and provides GDPR-compliant data export and deletion endpoints. Security headers are applied to every response via middleware, and image data has a 30-day retention policy.

## Gotchas for Downstream Agents
- **All API routes are rate limited**: If you add a new `/api/*` route, it automatically gets the general limit. Add specific limits for expensive routes.
- **scrubPII is not exhaustive**: It catches common patterns but not all PII. Don't rely on it for sensitive data you shouldn't receive anyway.
- **sanitizeForPrompt should be called on all user text before AI APIs**: Both analyze and advisor routes should use it.
- **GDPR endpoints return 401 for unauthenticated**: Ensure user is logged in before offering export/delete.
- **Rate limit headers are returned on every API response**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Middleware matcher is broad**: `matcher: ['/((?!_next|.*\..*).*)']` matches all non-static routes. Be careful with exclusions.

## ✅ FINAL REPORT — SECURITY_AGENT
**Session:** 1
**Files Created:** 5 + 1 verify script + middleware update
**Key Decisions:** Upstash Redis sliding window, IP-based general limit, regex PII scrubbing, anonymize alternative, middleware security headers
**Contracts Exported:** generalLimit, analysisLimit, tryonLimit, advisorLimit, scrubPII(), sanitizeForPrompt(), exportUserData(), deleteUserData(), anonymizeUserData(), /api/gdpr/export, /api/gdpr/delete
**Entitlement Checks Added:** None (applies globally)
**Gotchas for Downstream:** All API routes rate limited, scrubPII before AI calls, sanitizeForPrompt on user input, GDPR endpoints auth-only, Clerk user not deleted by GDPR route
**Tests Written:** `scripts/verify-security.js` — 20 checks
**Smoke Tests:** `npm run build` PASS, verify-security.js PASS (20/20)
**Verification Output:** All files verified
**Plain English Summary:** Built security layer with rate limiting, PII scrubbing, input sanitization, GDPR endpoints, and security headers.
**Git Commit:** Pending
**Status: COMPLETE**
