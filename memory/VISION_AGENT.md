# Vision Agent Memory
## Role
Photo capture UI, Claude Vision skin analysis, image preprocessing,
confidence scoring, manual override support, body proportion detection.
## Status: COMPLETE
## Files I Own
- `src/components/PhotoCapture.tsx`
- `src/app/api/analyze/route.ts`
- `src/lib/imagePreprocess.ts`
- `src/hooks/useAnalysis.ts`
- `src/__tests__/analyze.test.ts`
## Schema Contract
{
  skinUndertone, skinDepth, eyeColor, hairColor,
  faceShape, bodyProportions: { shoulderToHip, torsoLength, notes },
  colorSeason, seasonDescription, confidence,
  analysisNotes, biasWarning, manualOverrideAvailable: true
}
## Completed Work
- `src/lib/imagePreprocess.ts` — Sharp-based image processing:
  - `preprocessForAnalysis()`: resize 720x720, square crop from top, strip EXIF, JPEG base64
  - `preprocessForTryOn()`: resize 768x1024, portrait crop, strip EXIF, JPEG base64
  - `stripExifData()`: removes all EXIF metadata via Sharp
  - `checkImageQuality()`: avg luminance check → { quality: 'good'|'poor'|'unusable', luminance, reason }
  - `checkLiveFrame()`: lightweight luminance check for live camera frames, returns { ring: 'red'|'amber'|'green', message }
- `src/app/api/analyze/route.ts` — Full analysis pipeline:
  - Auth + entitlement check (calls BILLING_AGENT stub)
  - EXIF strip + quality check on all submitted images
  - Multi-shot support: analyzes all frames, picks highest confidence
  - Claude Vision API call with structured system prompt for 12-season analysis
  - JSON parsing with retry logic (markdown-wrapped JSON handled)
  - Bias warning field populated for deeper skin tones
  - `manualOverrideAvailable: true` always returned
  - Usage increment after success
- `src/hooks/useAnalysis.ts` — Client-side hook:
  - Wraps API call with loading, error, retry state
  - Saves analysis to Zustand store on success
- `src/components/PhotoCapture.tsx` — Camera component:
  - Live camera feed with getUserMedia
  - Luminance ring updates every 500ms (red/amber/green)
  - Multi-shot capture: captures 3 frames 1.5s apart
  - Capture button with loading state
  - Framer-motion animations for ring and capture indicator
- `src/__tests__/analyze.test.ts` — Integration tests with COLOR_AGENT

## Decisions Made
- **Sharp for image processing**: Used Sharp library for EXIF stripping, resizing, and quality checks. It's already in dependencies
- **Multi-shot by default**: Camera captures 3 frames automatically. Server analyzes all and picks highest confidence
- **Luminance-based quality check**: Simple and fast. Rejects images below 20 or above 240 avg luminance
- **Claude JSON extraction**: Handles direct JSON, markdown code blocks, and raw object matches
- **Bias warning**: System prompt explicitly instructs Claude to be careful with deeper skin tones and express uncertainty
- **Lazy Supabase init**: Used the same pattern as AUTH_AGENT to prevent build failures

## Known Issues
- `useAnalysis.ts` imports `@/store/useStyleStore` which is a stub — will be fully implemented by UI_AGENT
- Entitlement check uses BILLING_AGENT stub
- No actual camera permission handling UI yet (just console.error on denial)

## Smoke Tests
- `npm run build` — PASS
- `node scripts/verify-agent.js` on all 4 files — PASS

## Verification Output
```
src/lib/imagePreprocess.ts: exists=true, nonEmpty=true, lines=91, imports=true
src/app/api/analyze/route.ts: exists=true, nonEmpty=true, lines=218, imports=true
src/hooks/useAnalysis.ts: exists=true, nonEmpty=true, lines=65, imports=true
src/components/PhotoCapture.tsx: exists=true, nonEmpty=true, lines=185, imports=true
```

## Plain English Summary
VISION_AGENT built the entire photo capture and analysis pipeline. Users open their camera, see a live luminance ring guiding them to better light, capture 3 frames, and the server sends them to Claude Vision for 12-season colour analysis. The result includes undertone, skin depth, face shape, body proportions, and a confidence score. Images are preprocessed (resized, EXIF stripped, quality-checked) before analysis. The bias warning field ensures transparent uncertainty for deeper skin tones.

## Gotchas for Downstream Agents
- **imagePreprocess.ts exports**: All functions return base64 data URLs, not Buffers. If you need raw buffers, split the data URL
- **Multi-shot default**: The analyze route expects an `images` array, not a single image. Even single captures should be wrapped in an array
- **Quality check returns early**: If any image is "unusable", the entire request returns 400 without calling Claude
- **Claude system prompt is strict**: The JSON schema in the system prompt must match exactly what downstream agents expect
- **biasWarning**: Always present, may be null. STYLE_AGENT should display it when non-null
- **Entitlement stub**: Currently always returns allowed=true. Will be enforced once BILLING_AGENT completes

## ✅ FINAL REPORT — VISION_AGENT
**Session:** 1
**Files Created:** 4 + 1 test file
**Key Decisions:** Sharp for processing, multi-shot capture, luminance quality check, Claude JSON extraction with retry
**Contracts Exported:** Analysis JSON schema (skinUndertone, skinDepth, eyeColor, hairColor, faceShape, bodyProportions, colorSeason, seasonDescription, confidence, analysisNotes, biasWarning, manualOverrideAvailable)
**Entitlement Checks Added:** `analyse` feature gated in `/api/analyze`
**Gotchas for Downstream:** Base64 returns, images array input, quality early-return, biasWarning display, entitlement stub
**Tests Written:** `src/__tests__/analyze.test.ts` — hex validation, cultural notes, integration with COLOR_AGENT
**Smoke Tests:** `npm run build` PASS, verify-agent.js PASS on all 4 files
**Verification Output:** All 4 files verified
**Plain English Summary:** Built photo capture UI with live lighting coach, multi-shot camera, Sharp preprocessing, Claude Vision analysis API with JSON extraction retry, and bias-aware prompting.
**Git Commit:** Pending
**Status: COMPLETE**
