import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const categorySlug = searchParams.get('category')
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const skip = (page - 1) * limit

        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        let where = { 
            isActive: true,
            publishedDate: {
                lt: threeMonthsAgo
            }
        }
        
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
            orderBy: { publishedDate: 'desc' },
            skip,
            take: limit,
            include: {
                district: true,
                location: true,
                category: true
            }
        })

        // Shuffle first page as per "old chat" style randomization
        let finalNews = news;
        if (page === 1) {
            finalNews = [...news].sort(() => Math.random() - 0.5);
        }

        return NextResponse.json({
            success: true,
            data: finalNews,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        })

    } catch (error) {
        console.error('Error fetching evergreen news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
