import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const categorySlug = searchParams.get('category')
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const skip = (page - 1) * limit

        let where = { isActive: true }
        
        if (categorySlug) {
            const category = await prisma.category.findFirst({
                where: {
                    slug: categorySlug
                }
            })

            if (category) {
                where.OR = [
                    { categoryId: category.id },
                    {
                        categoryIds: {
                            contains: String(category.id)
                        }
                    }
                ]
            }
        }

        const totalItems = await prisma.news.count({ where })

        const news = await prisma.news.findMany({
            where,
            orderBy: { updatedAt: 'desc' }, // Recently updated
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
        console.error('Error fetching recently updated news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
