# Affiliate Agent Memory
## Role
Build affiliate-tracked shopping links for all outfit shopping suggestions.
Track click events. Generate analytics dashboard for admin. Support
ASOS (Awin), Farfetch, H&M (CJ Affiliate), M&S, Amazon UK Associates.
## Status: NOT STARTED
## Files I Own
- `lib/affiliate/linkBuilder.js`
- `lib/affiliate/programmes.js`
- `app/api/affiliate/click/route.js`
- `app/api/affiliate/analytics/route.js`
- `components/ShoppingLinks.jsx`
- `components/AffiliateDisclosure.jsx`
- `components/AdminAffiliateDashboard.jsx`
- `__tests__/affiliate.test.js`
## Link Contract (consumed by UI_AGENT via ShoppingLinks component)
Input: { searchQuery: string, priceRange: 'budget'|'mid'|'premium', item: string }
Output: Array<{ retailer, url, trackedUrl, commission, priceRange }>
## Retailer Routing by Price Range
budget → ASOS, H&M, M&S
mid → ASOS, Farfetch (sale), M&S Premium
premium → Farfetch, Net-a-Porter (if programme available)
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
