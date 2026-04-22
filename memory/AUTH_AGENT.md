# Auth Agent Memory
## Role
User authentication, account creation, session management, user profile linking.
Uses Clerk for auth UI + session. Links Clerk user ID to Supabase profile.
## Status: COMPLETE
## Files I Own
- `src/middleware.ts` (auth enforcement layer — hands off to SECURITY_AGENT for rate limiting)
- `src/app/api/auth/webhook/route.ts` (Clerk webhook → create Supabase user row)
- `src/lib/auth/clerk.ts`
- `src/lib/auth/session.ts`
- `src/components/auth/SignInButton.tsx`
- `src/components/auth/UserMenu.tsx`
- `src/hooks/useCurrentUser.ts`
## Auth Contract (consumed by BILLING_AGENT, PERSISTENCE_AGENT, ADVISOR_AGENT)
Every authenticated API route receives: { userId: string, email: string, tier: 'free'|'pro' }
## Completed Work
- Created `src/middleware.ts` with Clerk middleware protecting wardrobe, advisor, admin, and billing portal routes
- Created `src/app/api/auth/webhook/route.ts` handling `user.created` and `user.deleted` Clerk webhooks with Svix signature verification
- Created `src/lib/auth/session.ts` with `getAuthContext()` returning `{ userId, clerkId, email, tier }`
- Created `src/lib/auth/clerk.ts` re-exporting Clerk utilities for internal consistency
- Created `src/components/auth/SignInButton.tsx` with Vêtu-branded gold CTA button
- Created `src/components/auth/UserMenu.tsx` with Clerk UserButton and custom dark theme styling
- Created `src/hooks/useCurrentUser.ts` client-side hook fetching tier from `/api/billing/usage`
- Updated `src/app/layout.tsx` wrapping children in `<ClerkProvider>` with Vêtu dark theme customisation
- Updated `src/app/page.tsx` with basic landing page using auth components
- Installed `svix` dependency for webhook signature verification

## Decisions Made
- **Lazy Supabase client creation**: Supabase admin clients are created inside request handlers, not at module load time. This prevents build failures when env vars are not set during static generation
- **ClerkProvider custom theme**: Matched Clerk UI to Vêtu design system — dark background (#0A0A0B), gold primary (#C9A84C), paper text (#F7F4EF), rounded corners
- **Webhook events handled**: `user.created` (upsert to Supabase), `user.deleted` (soft delete)
- **Tier fetched client-side**: `useCurrentUser` calls `/api/billing/usage` to get tier after sign-in. This avoids server-side Supabase calls on every client render
- **UserButton simplified**: Removed custom menu items (`UserButton.Action`) because Clerk v5 API changed. Styling applied through `appearance` prop only

## Known Issues
- Custom menu items in `UserButton` removed due to Clerk v5 API changes. Will revisit when BILLING_AGENT builds the portal link
- `useCurrentUser` will 404 on `/api/billing/usage` until BILLING_AGENT creates that route

## Smoke Tests
- `npm run build` — PASS (compiled successfully, routes generated)
- `node scripts/verify-agent.js` on all 7 files — PASS

## Verification Output
```
src/middleware.ts: exists=true, nonEmpty=true, lines=22, imports=true
src/app/api/auth/webhook/route.ts: exists=true, nonEmpty=true, lines=74, imports=true
src/lib/auth/session.ts: exists=true, nonEmpty=true, lines=45, imports=true
src/lib/auth/clerk.ts: exists=true, nonEmpty=true, lines=4, imports=true
src/hooks/useCurrentUser.ts: exists=true, nonEmpty=true, lines=41, imports=true
src/components/auth/SignInButton.tsx: exists=true, nonEmpty=true, lines=14, imports=true
src/components/auth/UserMenu.tsx: exists=true, nonEmpty=true, lines=18, imports=true
```

## Plain English Summary
AUTH_AGENT integrated Clerk authentication into the Vêtu app. It created middleware that protects private routes, a webhook handler that syncs Clerk user events to Supabase, a server-side auth context helper that returns the user's tier, and client-side components for signing in and managing the user menu. The entire app is now wrapped in ClerkProvider with a custom dark theme that matches the Vêtu design system.

## Gotchas for Downstream Agents
- **Lazy Supabase initialization**: If you create a Supabase client in an API route, use a `getSupabaseAdmin()` function inside the handler, not a top-level `const`. Otherwise the build will fail when env vars are missing
- **AuthContext shape**: `getAuthContext()` returns `{ userId, clerkId, email, tier }`. `userId` is the Supabase UUID, `clerkId` is the Clerk user ID. Use `userId` for database queries, `clerkId` for Clerk API calls
- **Tier defaults to 'free'**: Unauthenticated users and users without entitlements get `tier: 'free'`
- **Clerk theme variables**: If you need to style Clerk components further, the custom theme is in `src/app/layout.tsx` in the `ClerkProvider` `appearance` prop
- **Protected routes**: `/wardrobe`, `/advisor`, `/admin`, `/api/wardrobe`, `/api/advisor`, `/api/billing/portal` all require auth

## ✅ FINAL REPORT — AUTH_AGENT
**Session:** 1
**Files Created:** 7
**Key Decisions:** Lazy Supabase init, Clerk dark theme, webhook sync, client-side tier fetching
**Contracts Exported:** AuthContext interface — { userId, clerkId, email, tier }
**Entitlement Checks Added:** None (auth layer only — entitlements handled by BILLING_AGENT)
**Gotchas for Downstream:** Lazy Supabase init pattern, AuthContext shape, tier defaults to free, ClerkProvider theme location
**Tests Written:** None (infrastructure — tests belong to TEST_AGENT)
**Smoke Tests:** `npm run build` PASS, verify-agent.js PASS on all 7 files
**Verification Output:** All 7 files verified
**Plain English Summary:** Integrated Clerk auth with middleware, webhooks, session helpers, and themed UI components. Build passes.
**Git Commit:** Pending
**Status: COMPLETE**
