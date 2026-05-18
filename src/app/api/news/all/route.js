import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const skip = (page - 1) * limit

        let where = { isActive: true }

        // Get total count for pagination
        const totalItems = await prisma.news.count({ where })

        const news = await prisma.news.findMany({
            where,
            orderBy: { publishedDate: 'desc' },
            skip,
            take: limit,
            include: {
                district: true,
                location: true,
                category: true
            }
        })

        return NextResponse.json({
            success: true,
            data: news,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        })

    } catch (error) {
        console.error('Error fetching all news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
