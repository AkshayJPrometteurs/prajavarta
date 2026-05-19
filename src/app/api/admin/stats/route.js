import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ADMIN_AUTH_COOKIE_NAME, AUTHOR_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

function getTokenFromRequest(request) {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }
    return request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value || request.cookies.get(AUTHOR_AUTH_COOKIE_NAME)?.value || null
}

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request)

        if (!token) {
            return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // If admin, return global stats
        if (decoded.role === 'ADMIN') {
            const [categories, news, users, authors] = await Promise.all([
                prisma.category.count(),
                prisma.news.count(),
                prisma.user.count(),
                prisma.user.count({ where: { role: 'AUTHOR' } })
            ])

            // sum of viewCount
            const viewsAgg = await prisma.news.aggregate({ _sum: { viewCount: true } })
            const totalViews = viewsAgg._sum.viewCount || 0

            return NextResponse.json({
                success: true,
                stats: {
                    categories,
                    news,
                    users,
                    authors,
                    totalViews,
                    totalComments: 0
                }
            })
        }

        // If author, return author-specific stats
        if (decoded.role === 'AUTHOR') {
            const authorId = decoded.userId
            const [myNewsCount, followersCount] = await Promise.all([
                prisma.news.count({ where: { authorId } }),
                prisma.authorFollower.count({ where: { authorId } })
            ])

            const viewsAgg = await prisma.news.aggregate({ where: { authorId }, _sum: { viewCount: true } })
            const myViews = viewsAgg._sum.viewCount || 0

            return NextResponse.json({
                success: true,
                stats: {
                    myNewsCount,
                    myViews,
                    myFollowers: followersCount
                }
            })
        }

        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    } catch (error) {
        console.error('Stats API error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
