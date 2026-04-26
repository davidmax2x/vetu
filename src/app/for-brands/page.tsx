import { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, TAGLINE, PRICING } from '@/lib/constants'

export const metadata: Metadata = {
  title: `For Brands | ${APP_NAME}`,
  description: `The colour analysis API for fashion. ${TAGLINE} Integrate AI-powered colour analysis into your retail or styling platform.`,
}

export default function ForBrandsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl font-bold text-[#F7F4EF] md:text-6xl lg:text-7xl">
            The colour analysis API for{' '}
            <span className="text-[#C9A84C]">fashion</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#7A7D88] md:text-xl">
            Integrate AI-powered colour analysis, outfit recommendations,
            and virtual try-on into your retail or styling platform.
          </p>
          <a
            href="#pricing"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#C9A84C] px-8 py-4 font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
          >
            View pricing
          </a>
        </div>
      </section>

      {/* What the API Does */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 text-[#C9A84C]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold text-[#F7F4EF]">Colour Analysis</h3>
              <p className="text-[#7A7D88]">
                12-season colour analysis from any photo.
                Returns season, undertone, depth, and confidence score.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 text-[#C9A84C]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.411 3.002 3.002 0 01-1.768 2.735 3.002 3.002 0 01-2.735-1.768 3 3 0 00-1.411-5.78 3.002 3.002 0 011.768-2.735 3.002 3.002 0 012.735 1.768 3 3 0 001.411 5.78 3.002 3.002 0 01-1.768 2.735 3.002 3.002 0 01-2.735-1.768 3 3 0 00-1.411-5.78 3.002 3.002 0 011.768-2.735 3.002 3.002 0 012.735 1.768 3 3 0 001.411 5.78z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold text-[#F7F4EF]">Outfit Recommendations</h3>
              <p className="text-[#7A7D88]">
                Generate personalized outfits based on colour season,
                body type, occasion, and cultural context.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 text-[#C9A84C]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-xl font-bold text-[#F7F4EF]">Virtual Try-On</h3>
              <p className="text-[#7A7D88]">
                Two-stage virtual try-on: generate garment images,
                then apply them to user photos using IDM-VTON.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            Two-line integration
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/80">
            <div className="flex items-center justify-between border-b border-[#E0DBD2]/10 bg-[#0A0A0B] px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm text-[#7A7D88]">analyze.js</span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm">
              <code className="text-[#F7F4EF]">{`const response = await fetch('https://vetu.ai/api/analyze', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({ image: base64Photo })
});

const { colorSeason, confidence } = await response.json();`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            Pricing
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-8">
              <h3 className="font-serif text-xl font-bold text-[#F7F4EF]">Starter</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#F7F4EF]">£{PRICING.API_STARTER}</span>
                <span className="text-[#7A7D88]">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[#7A7D88]">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1,000 API calls/month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Colour analysis
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
              <button className="mt-8 w-full rounded-lg border border-[#C9A84C]/50 py-3 text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/10">
                Get started
              </button>
            </div>

            <div className="relative rounded-2xl border-2 border-[#C9A84C] bg-[#0A0A0B]/80 p-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C9A84C] px-4 py-1 text-xs font-medium text-[#0A0A0B]">
                Most Popular
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F7F4EF]">Growth</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#F7F4EF]">£{PRICING.API_GROWTH}</span>
                <span className="text-[#7A7D88]">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[#7A7D88]">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5,000 API calls/month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Colour analysis + outfits
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Webhook notifications
                </li>
              </ul>
              <button className="mt-8 w-full rounded-lg bg-[#C9A84C] py-3 font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]">
                Get started
              </button>
            </div>

            <div className="rounded-2xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-8">
              <h3 className="font-serif text-xl font-bold text-[#F7F4EF]">Scale</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#F7F4EF]">£{PRICING.API_SCALE}</span>
                <span className="text-[#7A7D88]">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[#7A7D88]">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  20,000 API calls/month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Growth
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Virtual try-on included
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated support
                </li>
              </ul>
              <button className="mt-8 w-full rounded-lg border border-[#C9A84C]/50 py-3 text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/10">
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* White Label Section */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            Your brand, our engine
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#7A7D88]">
            White-label {APP_NAME} for your brand. Custom styling, your domain,
            your customers — powered by our AI.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@vetu.ai"
              className="inline-flex items-center justify-center rounded-lg bg-[#C9A84C] px-8 py-4 font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
            >
              Book a demo
            </a>
            <span className="text-sm text-[#7A7D88]">From £5,000/year</span>
          </div>
        </div>
      </section>
    </main>
  )
}
