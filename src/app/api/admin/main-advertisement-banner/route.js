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

export async function PUT(request) {
    try {
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json(
                { success: false, error: 'Banner image is required' },
                { status: 400 }
            )
        }

        const existingBanner = await prisma.mainAdvertisementBanner.findFirst({
            orderBy: { id: 'asc' }
        })

        const banner = existingBanner
            ? await prisma.mainAdvertisementBanner.update({
                where: { id: existingBanner.id },
                data: { image }
            })
            : await prisma.mainAdvertisementBanner.create({
                data: { image }
            })

        return NextResponse.json({
            success: true,
            data: banner,
            message: 'Main advertisement banner saved successfully'
        })
    } catch (error) {
        console.error('Error saving main advertisement banner:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
