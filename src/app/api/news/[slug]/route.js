import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

export async function GET(request, { params }) {
    try {
        const { slug } = await params
        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
        let saved = false

        const article = await prisma.news.findUnique({
            where: { slug },
            include: {
                author: true,
                district: true,
                location: true,
                category: true,
                galleryImages: true
            }
        })

        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
        }

        const categoryIds = article.categoryIds
            ? String(article.categoryIds)
                .split(',')
                .map((id) => Number(id.trim()))
                .filter((id) => !Number.isNaN(id))
            : []

        let categoryList = []
        if (categoryIds.length) {
            const categories = await prisma.category.findMany({
                where: {
                    id: { in: categoryIds }
                }
            })

            categoryList = categoryIds
                .map((id) => categories.find((category) => category.id === id))
                .filter(Boolean)
                .map((category) => ({
                    id: category.id,
                    name: category.name,
                    nameEnglish: category.nameEnglish,
                    slug: category.slug
                }))
        }

        if (token) {
            const decoded = verifyToken(token)
            if (decoded) {
                const savedArticle = await prisma.savedArticle.findUnique({
                    where: {
                        userId_newsId: {
                            userId: decoded.userId,
                            newsId: article.id,
                        },
                    },
                })
                saved = Boolean(savedArticle)
            }
        }

        // Increment view count
        await prisma.news.update({
            where: { id: article.id },
            data: { viewCount: { increment: 1 } }
        })

        // Related news
        const relatedNews = await prisma.news.findMany({
            where: {
                isActive: true,
                id: { not: article.id },
                OR: [
                    { categoryId: article.categoryId },
                    { 
                        categoryIds: { 
                            contains: String(article.categoryId) 
                        } 
                    }
                ]
            },
            take: 6,
            orderBy: { publishedDate: 'desc' },
            include: { category: true }
        })

        // Trending news for sidebar
        const trendingNews = await prisma.news.findMany({
            where: { isActive: true, isTrendingNews: true },
            take: 5,
            orderBy: { publishedDate: 'desc' },
            include: { category: true }
        })

        // Most Read news for sidebar
        const mostReadNews = await prisma.news.findMany({
            where: { isActive: true },
            take: 5,
            orderBy: { viewCount: 'desc' },
            include: { category: true }
        })

        return NextResponse.json({
            success: true,
            data: {
                categoryList,
                article,
                relatedNews,
                trendingNews,
                mostReadNews,
                saved
            }
        })

    } catch (error) {
        console.error('Error fetching article:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
