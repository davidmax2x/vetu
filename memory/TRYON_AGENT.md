# Try-On Agent Memory
## Role
Two-stage try-on: Stage 1 = SDXL garment image, Stage 2 = IDM-VTON.
Async polling, fallback handling, job status endpoint.
Pro-only feature gated by BILLING_AGENT entitlement check.
## Status: NOT STARTED
## Files I Own
- `app/api/garment/route.js`
- `app/api/tryon/route.js`
- `app/api/tryon/status/route.js`
- `lib/replicateClient.js`
- `hooks/useTryOnPolling.js`
- `__tests__/tryon.test.js`
## Pipeline Contract
Input: { userImageBase64, imagePrompt, userId }
Check entitlement before Stage 1. Abort with 403 if free tier.
Stage 1 output: garmentImageUrl
Stage 2 output: tryOnImageUrl
## Completed Work
_None_
## Decisions Made
_None_
## Known Issues
_None_
## Gotchas for Downstream Agents
_None yet_
## Final Report
_Pending_
