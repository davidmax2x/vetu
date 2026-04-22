# Billing Agent Memory
## Role
Stripe Checkout + webhooks, subscription lifecycle, entitlement table,
paywall middleware, free tier usage counter, usage-based API billing,
Pro PDF export, affiliate programme onboarding links.
## Status: NOT STARTED
## Files I Own
- `lib/billing/stripe.js`
- `lib/billing/entitlements.js`
- `app/api/billing/checkout/route.js`
- `app/api/billing/webhook/route.js`
- `app/api/billing/portal/route.js`
- `app/api/billing/usage/route.js`
- `components/PaywallModal.jsx`
- `components/PricingPage.jsx`
- `components/UsageBar.jsx`
- `hooks/useEntitlements.js`
- `__tests__/billing.test.js`
## Entitlement Contract (consumed by STYLE_AGENT, TRYON_AGENT, ADVISOR_AGENT)
Export: checkEntitlement(userId, feature) → { allowed: boolean, reason?: string, upgradeUrl?: string }
Features: 'analyse', 'tryon', 'advisor_chat', 'pdf_export', 'wardrobe_history', 'api_access'
## Tier Definitions
VÊTU FREE:        2 analyses/month, no try-on, 3 Aria messages/month, no PDF, no wardrobe
VÊTU PRO (£9.99): unlimited analyses, all 4 try-ons, unlimited Aria, PDF export, full wardrobe
VÊTU FOR BRANDS:  B2B API access, developer dashboard, usage-based billing (£199/mo+)
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
