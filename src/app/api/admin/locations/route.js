import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const [districts, subdivisions, tehsils] = await Promise.all([
            prisma.district.findMany({
                where: { isActive: true },
                orderBy: { name: 'asc' }
            }),
            prisma.subdivision.findMany({
                where: { isActive: true },
                orderBy: { name: 'asc' }
            }),
            prisma.tehsil.findMany({
                where: { isActive: true },
                orderBy: { name: 'asc' }
            })
        ])

        return NextResponse.json({
            success: true,
            data: {
                districts,
                subdivisions,
                tehsils
            }
        })
    } catch (error) {
        console.error('Error fetching locations:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
