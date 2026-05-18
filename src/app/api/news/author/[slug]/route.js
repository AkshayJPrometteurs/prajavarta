import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

export async function GET(request, { params }) {
    try {
        const { slug } = await params
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '9')
        const skip = (page - 1) * limit

        // 1. Fetch Author Details
        const author = await prisma.user.findFirst({
            where: {
                OR: [
                    { nameEnglish: slug },
                    { name: decodeURIComponent(slug) },
                    { role: 'AUTHOR' }
                ],
                isActive: true
            }
        })

        if (!author) {
            return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 })
        }

        // 2. Fetch Author's Latest Articles (Paginated)
        const [articles, totalArticles] = await Promise.all([
            prisma.news.findMany({
                where: { authorId: author.id, isActive: true },
                orderBy: { publishedDate: 'desc' },
                skip,
                take: limit,
                include: { category: true }
            }),
            prisma.news.count({
                where: { authorId: author.id, isActive: true }
            })
        ])

        // 3. Fetch Author's Most Read Articles
        const mostRead = await prisma.news.findMany({
            where: { authorId: author.id, isActive: true },
            orderBy: { viewCount: 'desc' },
            take: 5,
            include: { category: true }
        })

        // 4. Fetch Stats
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(now.getFullYear(), 0, 1)

        const [articlesThisMonth, articlesThisYear] = await Promise.all([
            prisma.news.count({
                where: {
                    authorId: author.id,
                    isActive: true,
                    publishedDate: { gte: startOfMonth }
                }
            }),
            prisma.news.count({
                where: {
                    authorId: author.id,
                    isActive: true,
                    publishedDate: { gte: startOfYear }
                }
            })
        ])

        // Raw SQL fallback for followers to bypass client sync issues
        let followerCount = 0
        try {
            const followCountResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM author_followers WHERE author_id = ${author.id}`
            followerCount = Number(followCountResult[0]?.count || 0)
        } catch (e) {
            console.error("Follower count raw query failed:", e)
        }

        // 5. Related Editors (Other active authors) with follow status
        let relatedEditors = await prisma.author.findMany({
            where: {
                id: { not: author.id },
                isActive: true
            },
            take: 3
        })

        // Check follow status for each related editor if user is logged in
        const token1 = request.cookies.get(AUTH_COOKIE_NAME)?.value
        let currentUser = null
        if (token1) {
            const decoded = verifyToken(token1)
            if (decoded) currentUser = decoded
        }

        if (currentUser) {
            relatedEditors = await Promise.all(relatedEditors.map(async (editor) => {
                const followResult = await prisma.$queryRaw`SELECT 1 as following FROM author_followers WHERE author_id = ${editor.id} AND user_id = ${currentUser.userId} LIMIT 1`
                return {
                    ...editor,
                    isFollowing: followResult.length > 0
                }
            }))
        } else {
            relatedEditors = relatedEditors.map(editor => ({ ...editor, isFollowing: false }))
        }

        // 6. Check if current user is following
        let isFollowing = false
        const token2 = request.cookies.get(AUTH_COOKIE_NAME)?.value
        if (token2) {
            const decoded = verifyToken(token2)
            if (decoded) {
                try {
                    const followCheckResult = await prisma.$queryRaw`SELECT 1 as following FROM author_followers WHERE author_id = ${author.id} AND user_id = ${decoded.userId} LIMIT 1`
                    isFollowing = followCheckResult.length > 0
                } catch (e) {
                    console.error("Follow check raw query failed:", e)
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                author,
                articles,
                mostRead,
                relatedEditors,
                isFollowing,
                stats: {
                    totalArticles,
                    articlesThisMonth,
                    articlesThisYear,
                    followers: followerCount
                },
                pagination: {
                    total: totalArticles,
                    page,
                    limit,
                    pages: Math.ceil(totalArticles / limit)
                }
            }
        })

    } catch (error) {
        console.error('Error fetching author details:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
