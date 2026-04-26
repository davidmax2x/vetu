# Persistence Agent Memory
## Role
Supabase DB schema, wardrobe history, feedback storage, lazy client init pattern.
## Status: COMPLETE
## Files I Own
- `src/lib/db/client.ts`
- `src/lib/db/wardrobe.ts`
- `src/lib/db/feedback.ts`
- `src/app/api/wardrobe/route.ts`
- `src/app/api/feedback/route.ts`
- `src/lib/db/schema.sql`
## DB Tables
- `users` — managed by AUTH_AGENT webhook (clerk_id, email, created_at, deleted_at)
- `entitlements` — managed by BILLING_AGENT (user_id, tier, created_at, updated_at)
- `saved_outfits` — PERSISTENCE_AGENT (user_id, outfit_data JSONB, occasion, season, created_at)
- `feedback` — PERSISTENCE_AGENT (user_id, outfit_id, type, comment, created_at, unique(user_id, outfit_id))
## Completed Work
- `src/lib/db/client.ts` — Shared `getSupabaseAdmin()` with lazy initialization. Same pattern as AUTH_AGENT.
- `src/lib/db/wardrobe.ts` — Wardrobe persistence layer:
  - `saveOutfit(userId, outfit)` — inserts outfit_data as JSONB
  - `getSavedOutfits(userId, limit)` — returns array ordered by created_at desc
  - `getSavedOutfitById(userId, outfitId)` — single scoped lookup
  - `deleteSavedOutfit(userId, outfitId)` — scoped delete (user_id + id)
- `src/lib/db/feedback.ts` — Feedback persistence layer:
  - `submitFeedback(userId, outfitId, type, comment?)` — upsert on (user_id, outfit_id)
  - `getFeedbackForOutfit(outfitId)` — aggregated { likes, dislikes }
  - `getUserFeedback(userId)` — user's feedback history
- `src/app/api/wardrobe/route.ts` — Wardrobe REST API:
  - POST `/api/wardrobe` — save outfit (Pro-only entitlement gate)
  - GET `/api/wardrobe` — list or single lookup via `?outfitId=`
  - DELETE `/api/wardrobe` — remove saved outfit
- `src/app/api/feedback/route.ts` — Feedback REST API:
  - POST `/api/feedback` — submit like/dislike with optional comment
  - GET `/api/feedback?outfitId=` — aggregate counts
  - GET `/api/feedback?user=true` — user's own feedback
- `src/lib/db/schema.sql` — Canonical schema definition:
  - `users`, `entitlements`, `saved_outfits`, `feedback` tables
  - Indexes on user_id, created_at, outfit_id
  - RLS comments for future SECURITY_AGENT enablement
- `scripts/verify-persistence.js` — 19 checks, all passing

## Decisions Made
- **Lazy Supabase init**: `getSupabaseAdmin()` creates client on demand, same pattern as AUTH_AGENT. Prevents build failures.
- **JSONB for outfit data**: `saved_outfits.outfit_data` stores the full Outfit object as JSONB. Flexible, no schema migration needed when outfit shape changes.
- **Upsert for feedback**: Unique constraint on (user_id, outfit_id) means users can change their mind (like → dislike) without creating duplicate rows.
- **Scoped deletes**: All deletions include `user_id` filter to prevent accidental cross-user deletion even if ID is guessed.
- **Pro-only wardrobe**: Entitlement check on POST. Free users can still view their existing saved outfits if they downgrade.
- **No localStorage fallback yet**: Unauthenticated users cannot save outfits. Will be added by UI_AGENT if needed.

## Known Issues
- Supabase env vars must be configured before any DB operations work
- No actual RLS policies yet — commented in schema.sql for SECURITY_AGENT
- `getSavedOutfits` does not paginate — limit defaults to 50

## Smoke Tests
- `npm run build` — PASS
- `npx tsx scripts/verify-persistence.js` — 19 passed, 0 failed

## Plain English Summary
PERSISTENCE_AGENT built the data persistence layer for Vêtu. It created a shared Supabase client with lazy initialization, functions to save and retrieve outfits, and a feedback system for liking or disliking outfits. Two REST APIs protect these operations with auth checks and entitlement gating. The database schema is defined in a single SQL file for easy setup.

## Gotchas for Downstream Agents
- **All DB functions require userId**: Never call without auth context
- **Wardrobe POST is Pro-only**: Free users get 429 with upgrade CTA
- **Feedback upserts**: Changing from like to dislike updates the same row
- **JSONB outfit_data**: If you need to query inside outfit JSON, use Supabase JSON operators
- **Schema.sql must be run manually**: No auto-migration yet; run in Supabase SQL Editor
- **Indexes are defined but RLS is not enabled yet**: SECURITY_AGENT will handle this

## ✅ FINAL REPORT — PERSISTENCE_AGENT
**Session:** 1
**Files Created:** 5 + 1 verify script + 1 schema file
**Key Decisions:** Lazy Supabase init, JSONB outfit data, upsert feedback, scoped deletes, Pro-only wardrobe POST
**Contracts Exported:** saveOutfit(), getSavedOutfits(), deleteSavedOutfit(), submitFeedback(), getFeedbackForOutfit(), /api/wardrobe, /api/feedback
**Entitlement Checks Added:** `wardrobe` feature gated in POST /api/wardrobe
**Gotchas for Downstream:** Pro-only wardrobe, feedback upserts, JSONB queries, manual schema setup, no RLS yet
**Tests Written:** `scripts/verify-persistence.js` — 19 checks
**Smoke Tests:** `npm run build` PASS, verify-persistence.js PASS (19/19)
**Verification Output:** All files verified
**Plain English Summary:** Built Supabase persistence layer with wardrobe save/retrieve, like/dislike feedback, and schema definition.
**Git Commit:** Pending
**Status: COMPLETE**
