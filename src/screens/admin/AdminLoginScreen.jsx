"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useReduxAuth } from '@/hooks/useReduxAuth'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLoginScreen() {
	const router = useRouter();
	const pathname = usePathname();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const { adminLogin } = useReduxAuth()

	const isAuthor = pathname?.startsWith('/author/login')
	const type = isAuthor ? 'author' : 'admin'

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setSubmitting(true)

		try {
			const result = await adminLogin(email, password, type)

			if (result.success) {
				router.push(isAuthor ? '/author' : '/admin')
			} else {
				setError(result.error)
			}
		} catch (error) {
			setError('An unexpected error occurred')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
			<div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
				<div className="mb-8">
					<Link href="/" className="text-sm font-medium text-orange-300 hover:text-orange-200">
						Back to site
					</Link>
					<h1 className="mt-6 text-3xl font-bold tracking-normal">{isAuthor ? 'Author' : 'Admin'} sign in</h1>
					<p className="mt-2 text-sm text-slate-300">
						Use an active {isAuthor ? 'author' : 'administrator'} account to continue.
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit}>
					{error && (
						<div className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
							{error}
						</div>
					)}

					<div>
						<label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-slate-200">
							Email address
						</label>
						<input
							id="admin-email"
							name="email"
							type="email"
							autoComplete="email"
							required
							className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
							placeholder="admin@example.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-200">
							Password
						</label>
						<input
							id="admin-password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
							placeholder="Password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
					</div>

					<button
						type="submit"
						disabled={submitting}
						className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting ? 'Signing in...' : `Sign in as ${isAuthor ? 'author' : 'admin'}`}
					</button>
				</form>
			</div>
		</main>
	)
}
