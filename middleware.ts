import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthBlue } from 'ssoauthblue/middleware'

// Test users for demonstration
const TEST_USERS = {
  'user1@example.com': {
    username: 'user1',
    email: 'user1@example.com',
    groups: ['team1-prc', 'team2-prc'] // User in two teams
  },
  'user2@example.com': {
    username: 'user2',
    email: 'user2@example.com',
    groups: ['team1-prc'] // User in one team
  }
}

export async function middleware(request: NextRequest) {
  // Skip auth check for public routes
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api/auth') ||
      request.nextUrl.pathname === '/unauthorized') {
    return NextResponse.next()
  }

  try {
    const isAuthenticated = await verifyAuthBlue(request)
    if (!isAuthenticated) {
      // Redirect to unauthorized page with return URL
      const returnUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)
      return NextResponse.redirect(new URL(`/unauthorized?returnUrl=${returnUrl}`, request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Auth verification failed:', error)
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
}

// Add routes that need authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /api/auth (auth endpoints)
     * 3. /unauthorized (unauthorized page)
     * 4. /_next/static (static files)
     * 5. /_next/image (image optimization files)
     * 6. /favicon.ico (favicon file)
     */
    '/((?!_next|api/auth|unauthorized|favicon.ico).*)',
  ],
}
