# Try-On Agent Memory
## Role
Two-stage virtual try-on pipeline: Stage 1 = SDXL garment image generation, Stage 2 = IDM-VTON fitting. Cost guardrails, entitlement checks, prewarming.
## Status: COMPLETE
## Files I Own
- `src/lib/replicate.ts`
- `src/app/api/tryon/route.ts`
- `src/components/TryOnModal.tsx`
- `scripts/verify-tryon.js`
## Pipeline Contract
Input: { outfitId, garmentPrompt, garmentDescription, personImageBase64, estimatedCost }
Check entitlement before Stage 1. Abort with 429 if free tier.
Stage 1 output: garmentImageUrl (SDXL)
Stage 2 output: tryOnImageUrl (IDM-VTON)
Cost guard: max £0.80/session. estimateTryOnCost() returns ~£0.055.
## Completed Work
- `src/lib/replicate.ts` — Replicate client wrapper:
  - `runModel(modelId, input, timeoutMs)` with AbortController timeout
  - `generateGarmentImage(garmentPrompt)` — Stage 1 SDXL with product photography prompt
  - `runIdmVton(personImageBase64, garmentImageUrl, garmentDescription)` — Stage 2
  - `prewarmModel(modelId)` — best-effort warmup prediction
  - `estimateTryOnCost()` — ~£0.055 per full pipeline
  - `checkSessionBudget(currentSpend)` — returns { allowed, remaining }
- `src/app/api/tryon/route.ts` — API route:
  - POST: two-stage pipeline with per-stage error handling
  - PUT: prewarm endpoint
  - Entitlement check: Pro-only (429 with upgrade CTA for free)
  - Budget check: rejects if would exceed £0.80/session
  - Returns: garmentImageUrl, tryOnImageUrl, totalCost, stage1Cost, stage2Cost
- `src/components/TryOnModal.tsx` — UI modal:
  - Idle / stage1 / stage2 / complete / error states
  - Side-by-side garment + try-on display
  - Stage progress dots
  - Cost display
  - Retry on error
- `scripts/verify-tryon.js` — 17 checks, all passing

## Decisions Made
- **Replicate SDK for both stages**: SDXL for garment generation, IDM-VTON for fitting. Both are Replicate models.
- **Cost guardrails at API layer**: `checkSessionBudget()` prevents runaway costs. Estimated per-run cost is £0.055.
- **Synchronous pipeline**: Both stages run in one POST request. No polling needed — Replicate SDK handles waiting.
- **AbortController for timeout**: Client-side timeout protection in addition to Replicate's internal timeout.
- **Prewarm endpoint**: PUT `/api/tryon` warms both models when outfit cards load (if PREWARM_ON_OUTFIT_VIEW is true).
- **Product photography prompt**: SDXL prompt explicitly asks for no model, no person, clean white background to get garment-only images.
- **Category locked to upper_body**: IDM-VTON accepts category parameter; we default to upper_body for reliability.

## Known Issues
- Replicate SDK `wait` option typed incorrectly in current version — cast to `any` for `timeout` field
- IDM-VTON may fail with low-quality person images — quality check happens upstream in VISION_AGENT
- TryOnModal uses `useStyleStore.getState()` inside click handler for cost display — this reads state at call time, not render time. Acceptable for display.

## Smoke Tests
- `npm run build` — PASS
- `npx tsx scripts/verify-tryon.js` — 17 passed, 0 failed

## Plain English Summary
TRYON_AGENT built the virtual try-on pipeline. When a user clicks "Try On" for an outfit, the system first generates a clean product photo of the garment using SDXL, then uses IDM-VTON to show that garment fitted on the user's own photo. The entire pipeline costs about 5.5p per run and is capped at 80p per session. It's a Pro-only feature. A modal UI guides users through the two stages with loading indicators and displays the before/after images side by side.

## Gotchas for Downstream Agents
- **TryOnModal requires `photoForTryOn` in store**: Must be set by VISION_AGENT/PhotoCapture before try-on works
- **API returns stage breakdown**: `stage1Cost` and `stage2Cost` let you show granular cost if needed
- **Prewarm is best-effort**: Don't block UI on prewarm response
- **Error states are per-stage**: `STAGE1_FAILED` vs `STAGE2_FAILED` — show different messaging
- **Entitlement is Pro-only**: Free tier gets 429 with `upgradeUrl: '/upgrade'`
- **Cost is in GBP**: Display as `£${cost.toFixed(3)}` for precision
- **Modal doesn't auto-open**: Consumer must manage `isOpen` state

## ✅ FINAL REPORT — TRYON_AGENT
**Session:** 1
**Files Created:** 3 + 1 verify script
**Key Decisions:** Replicate SDK for both stages, synchronous pipeline, AbortController timeout, cost guardrails at API, product photography prompt, upper_body default
**Contracts Exported:** runModel(), generateGarmentImage(), runIdmVton(), estimateTryOnCost(), checkSessionBudget(), /api/tryon POST+PUT, TryOnModal component
**Entitlement Checks Added:** `tryon` feature gated in `/api/tryon` — Pro-only
**Gotchas for Downstream:** photoForTryOn required, stage-specific errors, Pro-only, prewarm best-effort, cost in GBP
**Tests Written:** `scripts/verify-tryon.js` — 17 checks
**Smoke Tests:** `npm run build` PASS, verify-tryon.js PASS (17/17)
**Verification Output:** All files verified
**Plain English Summary:** Built two-stage virtual try-on pipeline with SDXL garment generation and IDM-VTON fitting, cost guardrails, Pro-only entitlement, and animated modal UI.
**Git Commit:** Pending
**Status: COMPLETE**
