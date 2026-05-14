import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - List active categories with pagination
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // Only return active categories
        const where = { isActive: true }

        // Get total count for pagination
        const total = await prisma.category.count({ where })

        // Get categories with pagination
        const categories = await prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: { sortOrder: 'asc' },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                slug: true,
                description: true,
                image: true,
                isActive: true,
                sortOrder: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            success: true,
            data: categories,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
