import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/wardrobe(.*)',
  '/advisor(.*)',
  '/admin(.*)',
  '/api/wardrobe(.*)',
  '/api/advisor(.*)',
  '/api/billing/portal(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }
  }
})

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] }
