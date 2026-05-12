import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    console.log('Registration API called')
    
    const { name, email, password } = await request.json()
    console.log('Received data:', { name, email: email.substring(0, 3) + '***', password: '***' })

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

    console.log('Hashing password...')
    const hashedPassword = await hashPassword(password)

    console.log('Creating user in database...')
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

    console.log('User created successfully:', user)
    const token = generateToken(user.id, user.email, user.role)

    const response = NextResponse.json({
      message: 'User registered successfully',
      token,
      user
    })
    console.log('Registration completed successfully')

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
