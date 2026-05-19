import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const s = await prisma.setting.findFirst()
        return NextResponse.json({ success: true, data: s || {} })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const body = await request.json()
        // Upsert settings: keep single row
        const data = await prisma.setting.upsert({
            where: { id: 1 },
            update: { ...body },
            create: { ...body },
        })
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
