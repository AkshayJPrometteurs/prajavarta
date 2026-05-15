import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
	try {
		const { email } = await request.json()

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			)
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			)
		}

		// Check if email already exists
		const existingNewsletter = await prisma.newsletter.findUnique({
			where: { email }
		})

		if (existingNewsletter) {
			if (existingNewsletter.isActive) {
				return NextResponse.json(
					{ error: 'Email already subscribed' },
					{ status: 409 }
				)
			} else {
				// Reactivate the subscription
				await prisma.newsletter.update({
					where: { email },
					data: { isActive: true }
				})
				return NextResponse.json({
					message: 'Subscription reactivated successfully'
				})
			}
		}

		// Create new newsletter subscription
		await prisma.newsletter.create({
			data: { email }
		})

		return NextResponse.json({
			message: 'Successfully subscribed to newsletter'
		})
	} catch (error) {
		console.error('Newsletter subscription error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
