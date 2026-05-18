import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        // Get all active categories excluding 'home' slug
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
                slug: { not: 'home-page' }
            },
            orderBy: { sortOrder: 'asc' }
        })

        // For each category, fetch the latest 1 news
        const megaNews = await Promise.all(
            categories.map(async (category) => {
                const newsResult = await prisma.$queryRaw`
                    SELECT *
                    FROM news
                    WHERE is_active = 1
                    AND (
                        category_ids = ${String(category.id)}
                        OR FIND_IN_SET(${String(category.id)}, category_ids) > 0
                    )
                    ORDER BY published_date DESC
                    LIMIT 1
                `

                const latestNews = newsResult[0] || null

                return {
                    category: {
                        id: category.id,
                        name: category.name,
                        slug: category.slug,
                        nameEnglish: category.nameEnglish
                    },

                    news: latestNews ? {
                        id: latestNews.id,
                        title: latestNews.title,
                        slug: latestNews.slug,
                        featuredImage: latestNews.featured_image,
                        publishedDate: latestNews.published_date
                    } : null
                }
            })
        )

        return NextResponse.json({
            success: true,
            data: megaNews
        })

    } catch (error) {

        console.error('Error fetching mega news:', error)

        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            {
                status: 500
            }
        )
    }
}