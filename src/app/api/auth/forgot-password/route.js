import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { setOtp } from '@/lib/otp-cache'

async function getSmtpConfig() {
    const smtp = await prisma.smtpSetting.findFirst()
    return smtp
}

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
    try {
        const body = await request.json()
        const { email } = body
        if (!email) return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            // Don't reveal user existence
            return NextResponse.json({ success: true, message: 'If the email exists, an OTP has been sent' })
        }

        const smtp = await getSmtpConfig()
        if (!smtp || !smtp.host || !smtp.email || !smtp.password) {
            return NextResponse.json({ success: false, error: 'SMTP not configured' }, { status: 500 })
        }

        const otp = generateOtp()
        setOtp(email, otp)

        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port || 587,
            secure: smtp.secure === 'SSL',
            auth: {
                user: smtp.email,
                pass: smtp.password
            }
        })

        const mailOptions = {
            from: smtp.email,
            to: email,
            subject: 'Your password reset OTP',
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ success: true, message: 'If the email exists, an OTP has been sent' })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
