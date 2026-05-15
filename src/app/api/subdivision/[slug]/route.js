import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const { slug } = await params

        // Find subdivision by nameEnglish (slug)
        const subdivision = await prisma.subdivision.findFirst({
            where: { 
                OR: [
                    { nameEnglish: slug },
                    { name: decodeURIComponent(slug) }
                ]
            },
            include: { district: true }
        })

        if (!subdivision) {
            return NextResponse.json(
                { success: false, error: 'Subdivision not found' },
                { status: 404 }
            )
        }

        // Get page and limit from query params
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const skip = (page - 1) * limit

        // Get total count for pagination
        const totalItems = await prisma.news.count({
            where: {
                subdivisionId: subdivision.id,
                isActive: true
            }
        })

        // Get news for this subdivision with pagination
        const news = await prisma.news.findMany({
            where: {
                subdivisionId: subdivision.id,
                isActive: true
            },
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
            data: {
                subdivision,
                news,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    limit
                }
            }
        })

    } catch (error) {
        console.error('Error fetching subdivision news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
