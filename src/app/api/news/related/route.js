import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const articleSlug = searchParams.get('slug')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit

        if (!articleSlug) {
            return NextResponse.json({ success: false, error: 'Article slug is required' }, { status: 400 })
        }

        // 1. Get the original article to find its category
        const article = await prisma.news.findUnique({
            where: { slug: articleSlug },
            select: { id: true, categoryId: true, categoryIds: true }
        })

        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
        }

        // 2. Build filter for related news
        // Match either primary categoryId or any ID in categoryIds string
        const filter = {
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
        }

        // 3. Fetch related news with pagination
        const [news, total] = await Promise.all([
            prisma.news.findMany({
                where: filter,
                skip,
                take: limit,
                orderBy: { publishedDate: 'desc' },
                include: {
                    category: true,
                    author: true
                }
            }),
            prisma.news.count({ where: filter })
        ])

        return NextResponse.json({
            success: true,
            data: news,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            context: {
                articleId: article.id,
                categoryId: article.categoryId
            }
        })

    } catch (error) {
        console.error('Error fetching related news:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
