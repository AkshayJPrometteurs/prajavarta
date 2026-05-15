import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5)
}

export async function GET(request, { params }) {
    try {
        const { slug } = await params

        // Find category by name or slug (params.slug is the dynamic segment)
        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: decodeURIComponent(slug) },
                    { slug: slug }
                ]
            }
        })

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            )
        }

        // Get all news for this category (including multiple categories)
        const allCategoryNews = await prisma.news.findMany({
            where: { isActive: true },
            orderBy: { publishedDate: 'desc' },
            take: 500,
            include: { 
                category: true,
                district: true,
                location: true
            }
        })

        // Filter news for this category
        const categoryNews = allCategoryNews.filter((news) => {
            // Single category
            if (news.categoryId === category.id) {
                return true
            }

            // Multiple categories
            if (news.categoryIds) {
                const ids = String(news.categoryIds)
                    .split(',')
                    .map(id => id.trim())

                return ids.includes(String(category.id))
            }

            return false
        })

        // 1. Latest News (first 6)
        const latestNews = categoryNews.slice(0, 6)

        // 2. Most Read News (by view count, shuffled)
        const mostReadNews = shuffleArray(categoryNews)
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 5)

        // 3. Trending News for this category
        const trendingNews = categoryNews
            .filter(news => news.isTrendingNews)
            .slice(0, 5)

        // 4. District-wise News (select news from 3 unique districts)
        const districtMap = new Map()
        categoryNews.forEach(news => {
            if (news.districtId && !districtMap.has(news.districtId)) {
                districtMap.set(news.districtId, news)
            }
        })
        const locationNews = Array.from(districtMap.values()).slice(0, 3)

        // 5. Evergreen Content (older news, shuffled)
        const evergreenNews = shuffleArray(categoryNews)
            .filter(news => {
                const publishedDate = new Date(news.publishedDate)
                const threeMonthsAgo = new Date()
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
                return publishedDate < threeMonthsAgo
            })
            .slice(0, 4)

        // 6. Related Tags (extract from tags field)
        const allTags = categoryNews
            .map(news => news.tags)
            .filter(Boolean)
            .join(', ')
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)

        const uniqueTags = [...new Set(allTags)].slice(0, 14)

        // 7. Get random Subdivisions for the "उप-विभाग" section
        const allSubdivisions = await prisma.subdivision.findMany({
            where: { isActive: true },
            take: 100
        })
        const randomSubdivisions = shuffleArray(allSubdivisions).slice(0, 6)

        // 8. Category stats
        const totalNews = categoryNews.length
        const lastUpdated = categoryNews[0]?.createdAt || null

        return NextResponse.json({
            success: true,
            data: {
                category: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    updatedAt: category.updatedAt,
                    createdAt: category.createdAt
                },
                latest_news: latestNews,
                most_read_news: mostReadNews,
                trending_news: trendingNews,
                location_news: locationNews,
                evergreen_news: evergreenNews,
                related_tags: uniqueTags,
                subdivisions: randomSubdivisions,
                stats: {
                    total_news: totalNews,
                    last_updated: lastUpdated
                }
            }
        })

    } catch (error) {
        console.error('Error fetching category data:', error)

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
