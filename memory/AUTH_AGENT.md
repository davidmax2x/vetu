# Auth Agent Memory
## Role
User authentication, account creation, session management, user profile linking.
Uses Clerk for auth UI + session. Links Clerk user ID to Supabase profile.
## Status: NOT STARTED
## Files I Own
- `middleware.js` (auth enforcement layer — hands off to SECURITY_AGENT for rate limiting)
- `app/api/auth/webhook/route.js` (Clerk webhook → create Supabase user row)
- `lib/auth/clerk.js`
- `lib/auth/session.js`
- `components/auth/SignInButton.jsx`
- `components/auth/UserMenu.jsx`
- `hooks/useCurrentUser.js`
## Auth Contract (consumed by BILLING_AGENT, PERSISTENCE_AGENT, ADVISOR_AGENT)
Every authenticated API route receives: { userId: string, email: string, tier: 'free'|'pro' }
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
