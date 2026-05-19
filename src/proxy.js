import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'
import {
	ADMIN_AUTH_COOKIE_NAME,
	AUTH_COOKIE_NAME,
	AUTHOR_AUTH_COOKIE_NAME
} from './lib/auth-cookie'

export function proxy(request) {
	const { pathname } = request.nextUrl

	const userToken =
		request.cookies.get(AUTH_COOKIE_NAME)?.value

	const adminToken =
		request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value

	const authorToken =
		request.cookies.get(AUTHOR_AUTH_COOKIE_NAME)?.value

	const user = userToken ? verifyToken(userToken) : null
	const admin = adminToken ? verifyToken(adminToken) : null
	const author = authorToken ? verifyToken(authorToken) : null

	/*
	|--------------------------------------------------------------------------
	| PUBLIC AUTH PAGES
	|--------------------------------------------------------------------------
	*/

	if (
		pathname === '/login' ||
		pathname === '/register' ||
		pathname === '/forgot-password'
	) {
		// ONLY CHECK USER LOGIN

		if (user) {
			return NextResponse.redirect(
				new URL('/', request.url)
			)
		}

		return NextResponse.next()
	}

	/*
	|--------------------------------------------------------------------------
	| ADMIN LOGIN
	|--------------------------------------------------------------------------
	*/

	if (pathname === '/admin/login') {
		if (admin?.role === 'ADMIN') {
			return NextResponse.redirect(
				new URL('/admin', request.url)
			)
		}

		return NextResponse.next()
	}

	/*
	|--------------------------------------------------------------------------
	| ADMIN PROTECTED
	|--------------------------------------------------------------------------
	*/

	if (pathname.startsWith('/admin')) {
		if (!admin || admin.role !== 'ADMIN') {
			const response = NextResponse.redirect(
				new URL('/admin/login', request.url)
			)

			if (adminToken) {
				response.cookies.delete(
					ADMIN_AUTH_COOKIE_NAME
				)
			}

			return response
		}

		return NextResponse.next()
	}

	/*
	|--------------------------------------------------------------------------
	| AUTHOR LOGIN
	|--------------------------------------------------------------------------
	*/

	if (pathname === '/author/login') {
		if (author?.role === 'AUTHOR') {
			return NextResponse.redirect(
				new URL('/author', request.url)
			)
		}

		return NextResponse.next()
	}

	/*
	|--------------------------------------------------------------------------
	| AUTHOR PROTECTED
	|--------------------------------------------------------------------------
	*/

	if (pathname.startsWith('/author')) {
		if (!author || author.role !== 'AUTHOR') {
			const response = NextResponse.redirect(
				new URL('/author/login', request.url)
			)

			if (authorToken) {
				response.cookies.delete(
					AUTHOR_AUTH_COOKIE_NAME
				)
			}

			return response
		}

		return NextResponse.next()
	}

	/*
	|--------------------------------------------------------------------------
	| USER PROTECTED
	|--------------------------------------------------------------------------
	*/

	const protectedPaths = [
		'/dashboard',
		'/profile'
	]

	const isProtectedPath = protectedPaths.some((path) =>
		pathname.startsWith(path)
	)

	if (isProtectedPath && !user) {
		const response = NextResponse.redirect(
			new URL('/login', request.url)
		)

		if (userToken) {
			response.cookies.delete(
				AUTH_COOKIE_NAME
			)
		}

		return response
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/admin/:path*',
		'/author/:path*',
		'/dashboard/:path*',
		'/profile/:path*',
		'/login',
		'/register',
		'/forgot-password'
	]
}