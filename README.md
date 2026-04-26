# Vêtu — Dressed with intention.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/davidmax2x/vetu)
[![Tests](https://img.shields.io/badge/tests-90%20passing-blue)](https://github.com/davidmax2x/vetu)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**AI personal style platform** with a persistent AI advisor. Analyzes your photo, determines your 12-season colour palette, and generates personalized outfit recommendations with virtual try-on.

## ✨ Features

- **Photo Analysis**: Claude Vision-powered colour analysis with bias-aware prompting for all skin tones
- **12-Season Palettes**: True Spring, Bright Spring, Light Spring, True Summer, Light Summer, Soft Summer, True Autumn, Soft Autumn, Deep Autumn, True Winter, Deep Winter, Bright Winter
- **AI Style Advisor**: "Aria" — your personal style advisor with memory and context
- **Virtual Try-On**: Two-stage pipeline (SDXL garment generation → IDM-VTON fitting)
- **Cultural Context**: Outfit recommendations for South Asian, West African, East Asian, Middle Eastern, and Latin American contexts
- **Body Type Advice**: Personalized recommendations based on proportions
- **Social Sharing**: Generate branded share cards for Instagram Stories and feed

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/davidmax2x/vetu.git
cd vetu

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.local.example .env.local

# 4. Fill in your API keys in .env.local
#    - ANTHROPIC_API_KEY (Claude Vision)
#    - REPLICATE_API_TOKEN (SDXL + IDM-VTON)
#    - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
#    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY
#    - STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET
#    - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
#    - NEXT_PUBLIC_POSTHOG_KEY

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Architecture

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS v4, Framer Motion animations |
| **Fonts** | Cormorant Garamond (display), DM Sans (body) |
| **Auth** | Clerk (sign-in, sessions, webhooks) |
| **Database** | Supabase (PostgreSQL + Row Level Security) |
| **AI/ML** | Anthropic Claude Vision, Replicate (SDXL, IDM-VTON) |
| **Payments** | Stripe Checkout + Customer Portal |
| **Rate Limiting** | Upstash Redis |
| **Analytics** | PostHog (EU data residency) |
| **Monitoring** | Sentry + Vercel Analytics |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router routes
│   ├── api/               # API routes (analyze, recommend, tryon, billing, etc.)
│   ├── for-every-complexion/  # Diversity landing page
│   └── for-brands/        # B2B API landing page
├── components/            # React components
│   ├── auth/             # SignInButton, UserMenu
│   ├── billing/          # UpgradeModal
│   ├── growth/           # ShareSheet, ReferralBadge, etc.
│   └── advisor/          # Chat interface
├── lib/                  # Utilities, API clients, constants
│   ├── analytics/        # PostHog integration
│   ├── billing/          # Stripe integration
│   ├── db/               # Supabase clients
│   ├── growth/           # Share cards, referrals
│   ├── security/         # Rate limiting, GDPR
│   └── advisor/          # Aria AI advisor
├── hooks/                # Custom React hooks
├── store/                # Zustand state management
└── __tests__/           # Vitest test suite
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ 90 tests passing
- analyze.test.ts — Photo analysis, multi-shot capture
- colorPalettes.test.ts — 12 season palettes, hex validation
- recommend.test.ts — Outfit generation, body type advice
- billing.test.ts — Entitlements, Stripe webhooks
- advisor.test.ts — AI advisor responses
- security.test.ts — Rate limiting, GDPR
- growth.test.ts — Share cards, referrals
- analytics/events.test.ts — PostHog event tracking

## 🎯 Features by Tier

| Feature | Free | Pro (£9.99/mo) | API |
|---------|------|----------------|-----|
| Photo Analysis | 2/month | Unlimited | 1,000-20,000/mo |
| Virtual Try-On | ❌ | ✅ | ✅ |
| AI Advisor | 3 msgs/mo | Unlimited | Unlimited |
| Wardrobe History | ❌ | ✅ | ✅ |
| PDF Export | ❌ | ✅ | ✅ |
| Watermark-Free Sharing | ❌ | ✅ | ✅ |

## 🛡️ Security & Privacy

- **Cost Guardrails**: £0.80/session cap with automatic abort
- **Rate Limiting**: Per-user limits on all endpoints
- **Data Privacy**: EXIF stripping, PII scrubbing, no image persistence
- **GDPR Compliance**: Data export (`/api/gdpr/export`) and deletion (`/api/gdpr/delete`) endpoints
- **Secure**: Stripe webhook signature verification, Clerk webhook verification

## 🚀 Deployment

**Vercel** (recommended):
```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard.

## 📊 Analytics Dashboards

Configure these PostHog dashboards after deployment:
- Retention: D7, D30, D90 cohort retention
- Funnel: Photo → Analysis → Outfit → Try-on → Upgrade
- Viral coefficient: Referral conversions
- Session depth: Avg outfits viewed per session

## 🤝 Affiliate Programmes

Integrated shopping links for:
- ASOS (Awin, 4% commission)
- H&M (CJ Affiliate, 7% commission)
- Marks & Spencer (Awin, 3% commission)
- Farfetch (8% commission)

## 📝 License

Private — all rights reserved.

---

**Built with intention.**

[Vêtu](https://vetu.ai) · [GitHub](https://github.com/davidmax2x/vetu) · [Issues](https://github.com/davidmax2x/vetu/issues)
