import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getOtp, deleteOtp } from '@/lib/otp-cache'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json()
    if (!email || !otp || !newPassword) return NextResponse.json({ success: false, error: 'Email, OTP and newPassword are required' }, { status: 400 })

    if (newPassword.length < 6) return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })

    const stored = getOtp(email)
    if (!stored) return NextResponse.json({ success: false, error: 'OTP expired or not found' }, { status: 400 })
    if (stored !== String(otp)) return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const hashed = await hashPassword(newPassword)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashed } })

    deleteOtp(email)

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
