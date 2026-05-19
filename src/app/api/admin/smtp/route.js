import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const data = await prisma.smtpSetting.findFirst()
        return NextResponse.json({ success: true, data: data || null })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const body = await request.json()
        const existing = await prisma.smtpSetting.findFirst()

        if (existing) {
            const updated = await prisma.smtpSetting.update({ where: { id: existing.id }, data: { smtpType: body.smtpType || null, host: body.host || null, email: body.email || null, password: body.password || null, secure: body.secure || null, port: body.port ? parseInt(body.port, 10) : null } })
            return NextResponse.json({ success: true, data: updated, message: 'SMTP settings updated' })
        }

        const created = await prisma.smtpSetting.create({ data: { smtpType: body.smtpType || null, host: body.host || null, email: body.email || null, password: body.password || null, secure: body.secure || null, port: body.port ? parseInt(body.port, 10) : null } })
        return NextResponse.json({ success: true, data: created, message: 'SMTP settings saved' })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
