import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { generalLimit, getClientIP, checkRateLimit } from '@/lib/security/rateLimit'

const isProtectedRoute = createRouteMatcher([
  '/wardrobe(.*)',
  '/advisor(.*)',
  '/admin(.*)',
  '/api/wardrobe(.*)',
  '/api/advisor(.*)',
  '/api/billing/portal(.*)',
  '/api/tryon(.*)',
  '/api/gdpr(.*)',
])

const isApiRoute = createRouteMatcher([
  '/api/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Rate limiting for all API routes
  if (isApiRoute(req)) {
    const ip = getClientIP(req)
    const { allowed, remaining, reset } = await checkRateLimit(ip, generalLimit)

    if (!allowed) {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        },
      })
    }
  }

  // Auth check for protected routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  // Continue with security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self)')

  return response
})

export const config = { matcher: ['/((?!_next|.*\..*).*)'] }
