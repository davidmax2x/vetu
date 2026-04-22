# Validator Agent Memory
## Role
Inter-agent handoff validation at 4 checkpoints. Has pipeline veto power.
Checks schema compliance, contract integrity, cross-agent data flow.
## Status: NOT STARTED
## Checkpoints
- CP1: After VISION + COLOR — before STYLE_AGENT
- CP2: After STYLE — before TRYON_AGENT
- CP3: After TRYON + PERSISTENCE + SECURITY + BILLING + AFFILIATE + ADVISOR — before UI_AGENT
- FINAL: After TEST_AGENT — project completion gate
## Files I Own
- `lib/validators/analyzeSchema.js`
- `lib/validators/outfitSchema.js`
- `lib/validators/tryonSchema.js`
- `lib/validators/hexValidator.js`
- `lib/validators/billingContracts.js`
- `lib/validators/advisorSchema.js`
- `__tests__/validators.test.js`
## Validation Log
_Empty_
## Final Report
_Pending_
