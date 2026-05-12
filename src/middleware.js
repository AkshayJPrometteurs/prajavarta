import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'
import { AUTH_COOKIE_NAME } from './lib/auth-cookie'

export function middleware(request) {
  const { pathname } = request.nextUrl

  const protectedPaths = ['/admin', '/dashboard', '/profile']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete(AUTH_COOKIE_NAME)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*']
}
