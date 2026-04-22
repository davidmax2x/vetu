# Growth Agent Memory
## Role
Share mechanic (branded result cards, one-tap social sharing), creator referral
programme (vanity URLs, commission tracking), "For every complexion" landing page,
"Vêtu for Brands" B2B landing page, "Add to Home Screen" PWA prompt, brand
pronunciation tooltip, referral mechanic.
## Status: NOT STARTED
## Files I Own
- `app/for-every-complexion/page.jsx`
- `app/for-brands/page.jsx`
- `app/api/share/card/route.js`
- `app/api/referral/route.js`
- `lib/growth/shareCard.js`
- `lib/growth/referral.js`
- `components/ShareSheet.jsx`
- `components/ReferralBadge.jsx`
- `components/PronunciationTooltip.jsx`
- `components/AddToHomeScreen.jsx`
- `components/ComingSoonWatermark.jsx`
- `__tests__/growth/shareCard.test.js`
- `__tests__/growth/referral.test.js`
## Share Card Contract
Input: { colorSeason, outfitName, tryOnImageUrl?, userId }
Output: PNG card (1080×1920 for Stories, 1080×1080 for feed)
Free: includes "Created with Vêtu" watermark bottom-right
Pro: watermark-free
## Referral Contract
- Each user gets a unique referral code at signup
- Referral URL: vetu.ai/r/[code]
- Creator URL: vetu.ai/by/[creatorSlug]
- Conversion: referred user completes first analysis = referral counts
- Reward: referrer gets +1 free analysis (non-Pro) or recognition (Pro)
- Creator reward: 20% of referred user's first Pro month
## Completed Work
_None_
## Decisions Made
_None_
## Final Report
_Pending_
