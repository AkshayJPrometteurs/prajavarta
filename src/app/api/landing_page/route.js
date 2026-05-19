import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5)
}

export async function GET() {
    try {
        // 1. Banner
        const banner = await prisma.mainAdvertisementBanner.findFirst({
            orderBy: { id: 'desc' }
        })

        const bannerImage = banner?.image
        const normalizedBanner = banner
            ? {
                  ...banner,
                  image:
                      typeof bannerImage === 'string'
                          ? bannerImage.startsWith('http')
                              ? bannerImage
                              : bannerImage.startsWith('/')
                              ? bannerImage
                              : `/${bannerImage}`
                          : null
              }
            : null

        // 2. Latest News
        const latestNewsData = await prisma.news.findMany({
            where: { isActive: true },
            orderBy: { publishedDate: 'desc' },
            take: 20,
            include: { category: true }
        })

        const latestNews = shuffleArray(latestNewsData).slice(0, 3)

        // 3. One Latest News
        const oneLatestNewsData = await prisma.news.findMany({
            where: { isActive: true },
            orderBy: { publishedDate: 'desc' },
            take: 10,
            include: { category: true }
        })

        const oneLatestNews = shuffleArray(oneLatestNewsData).slice(0, 1)

        // 4. Trending News
        const trendingNewsData = await prisma.news.findMany({
            where: {
                isTrendingNews: true,
                isActive: true
            },
            orderBy: { publishedDate: 'desc' },
            take: 20,
            include: { category: true }
        })

        const trendingNews = shuffleArray(trendingNewsData).slice(0, 6)

        // 5. Recommended News
        const recommendedNewsData = await prisma.news.findMany({
            where: { isActive: true },
            orderBy: { publishedDate: 'desc' },
            take: 30,
            include: { category: true }
        })

        const recommendedNews = shuffleArray(recommendedNewsData).slice(0, 6)

        // 6. Mini Trending News
        const miniTrendingNewsData = await prisma.news.findMany({
            where: {
                isMiniTrendingNews: true,
                isActive: true
            },
            orderBy: { publishedDate: 'desc' },
            take: 20,
            include: { category: true }
        })

        const miniTrendingNews = shuffleArray(miniTrendingNewsData).slice(0, 5)

        // 7. Categories Wise Data
        const recentNewsForCategories = await prisma.news.findMany({
            where: { isActive: true },
            orderBy: { publishedDate: 'desc' },
            take: 200,
            include: { category: true }
        })

        const categories = await prisma.category.findMany({
            where: { isActive: true, slug: { not: 'home-page' } },
            orderBy: { sortOrder: 'asc' }
        })

        const shuffledCategories = shuffleArray(categories)

        const categoriesWiseData = {}
        let catCount = 0

        for (const category of shuffledCategories) {
            const catNews = recentNewsForCategories.filter((news) => {
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

            const shuffledNews = shuffleArray(catNews).slice(0, 4)

            if (shuffledNews.length > 0) {
                categoriesWiseData[category.name] = shuffledNews
                catCount++
            }

            // Maximum 6 categories
            if (catCount >= 6) {
                break
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                banner: normalizedBanner,
                one_latest_news: oneLatestNews,
                latest_news: latestNews,
                trending_news: trendingNews,
                categories_wise_data: categoriesWiseData,
                recommended_news: recommendedNews,
                mini_trending_news: miniTrendingNews
            }
        })

    } catch (error) {
        console.error('Error fetching landing page data:', error)

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