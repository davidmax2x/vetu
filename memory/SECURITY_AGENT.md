# Security Agent Memory
## Role
Photo privacy, GDPR compliance, rate limiting (consumer + API tier),
cost guardrails, Anthropic logging opt-out, no-storage policy enforcement.
## Status: NOT STARTED
## Files I Own
- `lib/rateLimiter.js`
- `lib/costGuard.js`
- `lib/privacy.js`
- `app/api/privacy/route.js`
- `PRIVACY_POLICY.md`
## Security Contracts (all agents must comply)
1. No image data persisted server-side beyond request lifecycle
2. stripExifData() called before every Claude API call
3. Replicate predictions deleted after result returned
4. Free tier: 2 analyses per month per user
5. Pro tier: unlimited analyses, rate limit 20/hour
6. API tier: per-key limits tracked in Redis
7. Cost cap: £0.80 per session (abort if exceeded)
8. All processing in-memory only
## Completed Work
_None_
## Final Report
_Pending_
