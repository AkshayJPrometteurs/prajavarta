import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'
import { ADMIN_AUTH_COOKIE_NAME, AUTH_COOKIE_NAME } from './lib/auth-cookie'

export function proxy(request) {
	const { pathname } = request.nextUrl
	const userToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
	const adminToken = request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
	const user = userToken ? verifyToken(userToken) : null
	const admin = adminToken ? verifyToken(adminToken) : null

	if (pathname === '/login' || pathname === '/register') {
		if (admin?.role === 'ADMIN') {
			return NextResponse.redirect(new URL('/admin', request.url))
		}

		if (user) {
			return NextResponse.redirect(new URL('/', request.url))
		}

		return NextResponse.next()
	}

	if (pathname === '/admin/login') {
		if (admin?.role === 'ADMIN') {
			return NextResponse.redirect(new URL('/admin', request.url))
		}

		return NextResponse.next()
	}

	if (pathname.startsWith('/admin')) {
		if (!admin || admin.role !== 'ADMIN') {
			const response = NextResponse.redirect(new URL('/admin/login', request.url))

			if (adminToken) {
				response.cookies.delete(ADMIN_AUTH_COOKIE_NAME)
			}

			return response
		}

		return NextResponse.next()
	}

	const protectedPaths = ['/dashboard', '/profile']
	const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

	if (isProtectedPath && !user) {
		const response = NextResponse.redirect(new URL('/login', request.url))

		if (userToken) {
			response.cookies.delete(AUTH_COOKIE_NAME)
		}

		return response
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*', '/login', '/register']
}
