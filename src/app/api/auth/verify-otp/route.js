import { NextResponse } from 'next/server'
import { getOtp } from '@/lib/otp-cache'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()
    if (!email || !otp) return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 })

    const stored = getOtp(email)
    if (!stored) return NextResponse.json({ success: false, error: 'OTP expired or not found' }, { status: 400 })
    if (stored !== String(otp)) return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 })

    return NextResponse.json({ success: true, message: 'OTP verified' })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
