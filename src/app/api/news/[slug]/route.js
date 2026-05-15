import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const { slug } = await params
        
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
                article,
                relatedNews,
                trendingNews,
                mostReadNews
            }
        })

    } catch (error) {
        console.error('Error fetching article:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
