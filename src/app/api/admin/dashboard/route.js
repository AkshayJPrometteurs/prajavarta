import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ADMIN_AUTH_COOKIE_NAME, AUTHOR_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

// Simple in-memory cache
const CACHE_TTL = 1000 * 60 * 2 // 2 minutes
const cache = new Map()

function getTokenFromRequest(request) {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }
    return request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value || request.cookies.get(AUTHOR_AUTH_COOKIE_NAME)?.value || null
}

function monthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0)
}

function monthEnd(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0)
}

function getMonthsForYear(year) {
    const res = []
    for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1)
        res.push({ label: d.toLocaleString('default', { month: 'short' }), date: d })
    }
    return res
}

function getLastNMonths(n) {
    const res = []
    const now = new Date()
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        res.push({ label: d.toLocaleString('default', { month: 'short' }), date: d })
    }
    return res
}

export async function GET(request) {
    try {
        const url = new URL(request.url)
        const yearParam = url.searchParams.get('year')
        const year = yearParam === 'all' ? null : yearParam ? parseInt(yearParam, 10) : new Date().getFullYear()

        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const cacheKey = `${decoded.role}:${decoded.userId || 'all'}:${year || 'all'}`
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
            return NextResponse.json(cached.value)
        }

        // ADMIN
        if (decoded.role === 'ADMIN') {
            const isAll = !year
            const startOfYear = year ? new Date(year, 0, 1) : null
            const startOfNextYear = year ? new Date(year + 1, 0, 1) : null

            const [categories, news, users, authors] = await Promise.all([
                isAll ? prisma.category.count() : prisma.category.count({ where: { createdAt: { gte: startOfYear, lt: startOfNextYear } } }),
                isAll ? prisma.news.count() : prisma.news.count({ where: { createdAt: { gte: startOfYear, lt: startOfNextYear } } }),
                isAll ? prisma.user.count() : prisma.user.count({ where: { createdAt: { gte: startOfYear, lt: startOfNextYear } } }),
                isAll ? prisma.user.count({ where: { role: 'AUTHOR' } }) : prisma.user.count({ where: { role: 'AUTHOR', createdAt: { gte: startOfYear, lt: startOfNextYear } } })
            ])

            const viewsAgg = isAll ? await prisma.news.aggregate({ _sum: { viewCount: true } }) : await prisma.news.aggregate({ where: { createdAt: { gte: startOfYear, lt: startOfNextYear } }, _sum: { viewCount: true } })
            const totalViews = viewsAgg._sum.viewCount || 0

            const months = year ? getMonthsForYear(year) : getLastNMonths(12)
            const labels = months.map((m) => m.label)
            const data = []
            for (const m of months) {
                const start = monthStart(m.date)
                const end = monthEnd(m.date)
                const count = await prisma.user.count({ where: { createdAt: { gte: start, lt: end } } })
                data.push(count)
            }

            const resObj = {
                success: true,
                stats: { categories, news, users, authors, totalViews, totalComments: 0 },
                chart: { labels, data },
                states: { categories, news, users, authors }
            }

            cache.set(cacheKey, { ts: Date.now(), value: resObj })
            return NextResponse.json(resObj)
        }

        // AUTHOR
        if (decoded.role === 'AUTHOR') {
            const authorId = decoded.userId
            const isAll = !year
            const startOfYear = year ? new Date(year, 0, 1) : null
            const startOfNextYear = year ? new Date(year + 1, 0, 1) : null

            const myNewsCount = isAll ? await prisma.news.count({ where: { authorId } }) : await prisma.news.count({ where: { authorId, createdAt: { gte: startOfYear, lt: startOfNextYear } } })
            const followersCount = isAll ? await prisma.authorFollower.count({ where: { authorId } }) : await prisma.authorFollower.count({ where: { authorId, createdAt: { gte: startOfYear, lt: startOfNextYear } } })
            const viewsAgg = isAll ? await prisma.news.aggregate({ where: { authorId }, _sum: { viewCount: true } }) : await prisma.news.aggregate({ where: { authorId, createdAt: { gte: startOfYear, lt: startOfNextYear } }, _sum: { viewCount: true } })
            const myViews = viewsAgg._sum.viewCount || 0

            const months = year ? getMonthsForYear(year) : getLastNMonths(12)
            const labels = months.map((m) => m.label)
            const data = []
            for (const m of months) {
                const start = monthStart(m.date)
                const end = monthEnd(m.date)
                const count = await prisma.news.count({ where: { authorId, createdAt: { gte: start, lt: end } } })
                data.push(count)
            }

            const resObj = {
                success: true,
                stats: { myNewsCount, myViews, myFollowers: followersCount },
                chart: { labels, data },
                states: { myNewsCount, myViews, myFollowers: followersCount }
            }

            cache.set(cacheKey, { ts: Date.now(), value: resObj })
            return NextResponse.json(resObj)
        }

        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    } catch (error) {
        console.error('Dashboard API error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
