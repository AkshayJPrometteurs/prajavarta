import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const banner = await prisma.mainAdvertisementBanner.findFirst({
            orderBy: { id: 'asc' }
        })

        return NextResponse.json({
            success: true,
            data: banner
        })
    } catch (error) {
        console.error('Error fetching main advertisement banner:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}