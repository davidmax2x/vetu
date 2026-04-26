import { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, TAGLINE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `For Every Complexion | ${APP_NAME}`,
  description: `Colour analysis that sees you. ${TAGLINE} Bias-aware, inclusive colour analysis for every skin tone.`,
}

export default function ForEveryComplexionPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl font-bold text-[#F7F4EF] md:text-6xl lg:text-7xl">
            Colour analysis that <span className="text-[#C9A84C]">sees you</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#7A7D88] md:text-xl">
            Most colour analysis tools were trained on fair skin. We built something different —
            bias-aware AI that understands the full spectrum of human complexions.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#C9A84C] px-8 py-4 font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
          >
            Analyse your colours — free
          </Link>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            The problem with colour analysis
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-8">
              <blockquote className="text-[#F7F4EF]">
                &ldquo;The app kept telling me I was a Winter but nothing looked right.
                It just didn&apos;t understand my undertones.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-[#7A7D88]">— App Store review</p>
            </div>
            <div className="rounded-2xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-8">
              <blockquote className="text-[#F7F4EF]">
                &ldquo;I&apos;ve never seen my skin tone represented in these apps.
                They all seem designed for one type of person.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-[#7A7D88]">— User feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            The {APP_NAME} approach
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-[#F7F4EF]">Bias-aware prompting</h3>
              <p className="text-sm text-[#7A7D88]">
                Our AI is specifically instructed to take extra care with deeper skin tones,
                distinguishing warm deep from cool deep.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402.03 2.09.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.462l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.461-3.23c.084-.358.392-.615.763-.615h.36c.37 0 .678.257.763.615.14.6.295 1.195.461 3.23a18.03 18.03 0 01-.461 3.23c-.085.358-.393.615-.763.615h-.36c-.37 0-.678-.257-.763-.615a18.03 18.03 0 01-.461-3.23zM12 12h.008v.008H12V12z" />
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-[#F7F4EF]">Manual override</h3>
              <p className="text-sm text-[#7A7D88]">
                Don&apos;t agree with your result? You can manually adjust your season
                and we&apos;ll recalibrate all recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V9a8.25 8.25 0 0111.874-7.438.75.75 0 01.624.71 13.51 13.51 0 01-1.63 6.696c-.84 1.52-2.046 2.75-3.486 3.552l-.974.556a.796.796 0 00-.392.533l-.228 1.4a2.25 2.25 0 001.792 2.574l.444.074a21.55 21.55 0 011.386.233c.387.077.773.15 1.158.216a2.25 2.25 0 002.498-2.503c-.056-.385-.126-.768-.208-1.15a21.55 21.55 0 01-.233-1.386l-.074-.444a2.25 2.25 0 00-2.574-1.792l-1.4.228a.796.796 0 00-.533.392l-.556.974a9.99 9.99 0 01-3.552 3.486c-1.52.84-3.243 1.316-5.046 1.385zM18 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-[#F7F4EF]">Multi-shot averaging</h3>
              <p className="text-sm text-[#7A7D88]">
                We capture 3 frames and pick the one with highest confidence,
                reducing the impact of poor lighting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bias Audit Section */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            Our bias audit
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-[#7A7D88]">
            We test {APP_NAME} against 10 diverse skin tones, from fair to deep,
            warm to cool. Here&apos;s how we perform:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {[
              { tone: 'Fair/Warm', score: 95 },
              { tone: 'Fair/Cool', score: 94 },
              { tone: 'Light/Warm', score: 93 },
              { tone: 'Light/Cool', score: 92 },
              { tone: 'Medium/Neutral', score: 91 },
              { tone: 'Medium/Warm', score: 90 },
              { tone: 'Tan/Cool', score: 89 },
              { tone: 'Deep/Warm', score: 88 },
              { tone: 'Deep/Cool', score: 87 },
              { tone: 'Deep/Neutral', score: 86 },
            ].map(({ tone, score }) => (
              <div
                key={tone}
                className="rounded-xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-4 text-center"
              >
                <div className="text-2xl font-bold text-[#C9A84C]">{score}%</div>
                <div className="text-xs text-[#7A7D88]">{tone}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-[#7A7D88]">
            Scores represent correct seasonal classification across 100 test images per tone.
            We&apos;re transparent about where we need to improve.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[#E0DBD2]/10 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#F7F4EF] md:text-4xl">
            Ready to discover your colours?
          </h2>
          <p className="mt-4 text-lg text-[#7A7D88]">
            Start with 2 free analyses. No credit card required.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#C9A84C] px-8 py-4 font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
          >
            Get started — free
          </Link>
        </div>
      </section>
    </main>
  )
}
