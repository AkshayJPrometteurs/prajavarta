import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request) {
	try {
		const { name, email, password } = await request.json()

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			)
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Password must be at least 6 characters long' },
				{ status: 400 }
			)
		}

		const existingUser = await prisma.user.findUnique({
			where: { email }
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 409 }
			)
		}

		const hashedPassword = await hashPassword(password)

		const user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true
			}
		})

		const token = generateToken(user.id, user.email, user.role)

		const response = NextResponse.json({
			message: 'User registered successfully',
			token,
			user
		})

		return response
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
