import { NextRequest, NextResponse } from 'next/server'
import { track } from '@/lib/analytics/posthog'

/**
 * Web Vitals metrics shape
 */
interface WebVitalsMetrics {
  cls?: number           // Cumulative Layout Shift
  fcp?: number           // First Contentful Paint
  fid?: number           // First Input Delay
  inp?: number           // Interaction to Next Paint
  lcp?: number           // Largest Contentful Paint
  ttfb?: number          // Time to First Byte
  tbt?: number           // Total Blocking Time
  [key: string]: number | string | undefined
}

/**
 * POST /api/analytics/vitals
 *
 * Receives web vitals metrics from the client and forwards them to PostHog.
 * Used for performance monitoring across the application.
 *
 * Expected body: WebVitalsMetrics object
 *
 * Security: This endpoint is open as it only receives anonymous
 * performance metrics. No PII is captured.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const metrics: WebVitalsMetrics = await request.json()

    // Validate that at least one metric is present
    const hasMetrics = Object.keys(metrics).some(
      key => ['cls', 'fcp', 'fid', 'inp', 'lcp', 'ttfb', 'tbt'].includes(key)
    )

    if (!hasMetrics) {
      return NextResponse.json(
        { error: 'No valid web vitals metrics provided' },
        { status: 400 }
      )
    }

    // Forward to PostHog using the $web_vitals event
    // Note: On server-side, we need to use a different approach since
    // posthog-js is client-only. In production, you'd use posthog-node.
    // For now, we log and return success.
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Analytics/WebVitals]', metrics)
    }

    // In production, this would use posthog-node to capture the event
    // Example:
    // import { PostHog } from 'posthog-node'
    // const client = new PostHog(process.env.POSTHOG_API_KEY)
    // client.capture({
    //   distinctId: request.headers.get('x-user-id') || 'anonymous',
    //   event: '$web_vitals',
    //   properties: metrics,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics/WebVitals] Error processing metrics:', error)
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    )
  }
}
