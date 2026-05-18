import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5)
}

export async function GET(request, { params }) {
    try {
        const { slug } = await params

        console.log('Received slug:', slug)

        // Find category using slug or name
        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: decodeURIComponent(slug) },
                    { nameEnglish: decodeURIComponent(slug) },
                ]
            }
        })

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Category not found'
                },
                {
                    status: 404
                }
            )
        }

        // Fetch all active news
        const allNews = await prisma.news.findMany({
            where: {
                isActive: true,
                OR: [{
                    categoryIds: {
                        contains: String(category.id)
                    }
                }]
            },
            orderBy: {
                publishedDate: 'desc'
            },
            take: 500,
            include: {
                category: true,
                district: true,
                location: true
            }
        })

        // Exact category match
        const categoryNews = allNews.filter((news) => {

            // categoryIds example:
            // "8"
            // "8,7,5"
            // "2,3,4"

            if (!news.categoryIds) return false

            const idsArray = String(news.categoryIds)
                .split(',')
                .map(id => id.trim())
                .filter(Boolean)

            return idsArray.includes(String(category.id))
        })

        // Latest News
        const latestNews = categoryNews.slice(0, 6)

        // Most Read News
        const mostReadNews = [...categoryNews]
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 5)

        // Trending News
        const trendingNews = categoryNews
            .filter(news => news.isTrendingNews)
            .slice(0, 5)

        // District-wise News
        const districtMap = new Map()

        categoryNews.forEach(news => {
            if (
                news.districtId &&
                !districtMap.has(news.districtId)
            ) {
                districtMap.set(news.districtId, news)
            }
        })

        const locationNews = Array.from(districtMap.values()).slice(0, 3)

        // Evergreen News
        const evergreenNews = shuffleArray(categoryNews)
            .filter(news => {
                const publishedDate = new Date(news.publishedDate)

                const threeMonthsAgo = new Date()
                threeMonthsAgo.setMonth(
                    threeMonthsAgo.getMonth() - 3
                )

                return publishedDate < threeMonthsAgo
            })
            .slice(0, 4)

        // Related Tags
        const allTags = categoryNews
            .map(news => news.tags)
            .filter(Boolean)
            .join(',')
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)

        const uniqueTags = [...new Set(allTags)].slice(0, 14)

        // Random Subdivisions
        const allSubdivisions =
            await prisma.subdivision.findMany({
                where: {
                    isActive: true
                },
                take: 100
            })

        const randomSubdivisions =
            shuffleArray(allSubdivisions).slice(0, 6)

        // Stats
        const totalNews = categoryNews.length

        const lastUpdated =
            categoryNews[0]?.createdAt || null

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

        console.error(
            'Error fetching category data:',
            error
        )

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