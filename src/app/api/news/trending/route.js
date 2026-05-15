import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get('categoryId')

        let where = { isActive: true }
        
        if (categoryId) {
            // Support both single category and comma-separated IDs
            where.OR = [
                { categoryId: parseInt(categoryId) },
                {
                    categoryIds: {
                        contains: categoryId
                    }
                }
            ]
            where.isTrendingNews = true
        } else {
            // If no category, show any trending or random news
            where.isTrendingNews = true
        }

        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const skip = (page - 1) * limit

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

        // If no trending news found, return random recent news
        if (news.length === 0 && page === 1) {
            const randomNews = await prisma.news.findMany({
                where: { isActive: true },
                orderBy: { publishedDate: 'desc' },
                take: limit,
                include: {
                    district: true,
                    location: true,
                    category: true
                }
            })
            return NextResponse.json({
                success: true,
                data: randomNews.sort(() => Math.random() - 0.5),
                pagination: {
                    totalItems: randomNews.length,
                    totalPages: 1,
                    currentPage: 1,
                    limit
                }
            })
        }

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
        console.error('Error fetching trending news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
