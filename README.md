# Vêtu — Dressed with intention.

AI personal style platform with a persistent AI advisor. Built with Next.js, TypeScript, Tailwind CSS, Supabase, Clerk, Stripe, and Claude.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local

# 3. Fill in your API keys in .env.local
#    - Anthropic (Claude Vision)
#    - Replicate (SDXL + IDM-VTON)
#    - Supabase (database)
#    - Clerk (auth)
#    - Stripe (billing)
#    - Upstash Redis (rate limiting)

# 4. Run the dev server
npm run dev
```

## Architecture

- **Frontend**: Next.js 15 App Router, React 19, Tailwind CSS v4, Framer Motion
- **Auth**: Clerk (sign-in, sessions, webhooks)
- **Database**: Supabase (Postgres + Row Level Security)
- **AI**: Anthropic Claude (vision analysis, outfit recommendations, advisor chat)
- **Try-on**: Replicate (SDXL garment generation + IDM-VTON virtual try-on)
- **Billing**: Stripe Checkout + Customer Portal
- **Rate Limiting**: Upstash Redis
- **Analytics**: PostHog + Vercel Analytics
- **Monitoring**: Sentry

## Project Structure

```
src/
  app/              # Next.js App Router routes
  components/       # React components
  hooks/            # Custom React hooks
  lib/              # Utilities, API clients, constants
  store/            # Zustand state
```

## Environment Variables

See `.env.local.example` for the full list of required variables.

## Testing

```bash
npm test
```

## Deployment

Vercel (configured via `vercel.json`). Set all environment variables in the Vercel dashboard.

## License

Private — all rights reserved.
