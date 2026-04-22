# Vision Agent Memory
## Role
Photo capture UI, Claude Vision skin analysis, image preprocessing,
confidence scoring, manual override support, body proportion detection.
## Status: NOT STARTED
## Files I Own
- `components/PhotoCapture.jsx`
- `app/api/analyze/route.js`
- `lib/imagePreprocess.js`
- `hooks/useAnalysis.js`
- `__tests__/analyze.test.js`
## Schema Contract
{
  skinUndertone, skinDepth, eyeColor, hairColor,
  faceShape, bodyProportions: { shoulderToHip, torsoLength, notes },
  colorSeason, seasonDescription, confidence,
  analysisNotes, biasWarning, manualOverrideAvailable: true
}
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
