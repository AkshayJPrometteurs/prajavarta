import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ADMIN_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

export async function GET(request) {
    try {
        const token = request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
        const decoded = token ? verifyToken(token) : null

        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
        const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 50)
        const skip = (page - 1) * limit
        const search = searchParams.get('search')?.trim() || ''

        const where = {
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { message: { contains: search, mode: 'insensitive' } }
                ]
            })
        }

        const [totalItems, notifications] = await Promise.all([
            prisma.notification.count({ where }),
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    author: { select: { id: true, name: true, email: true } }
                }
            })
        ])

        return NextResponse.json({
            success: true,
            data: notifications,
            pagination: {
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1),
                currentPage: page,
                limit
            }
        })
    } catch (error) {
        console.error('Error fetching admin notifications:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PATCH(request) {
    try {
        const token = request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
        const decoded = token ? verifyToken(token) : null

        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { ids } = await request.json()
        const parsedIds = Array.isArray(ids)
            ? ids.map((id) => parseInt(id, 10)).filter(Boolean)
            : []

        if (parsedIds.length === 0) {
            return NextResponse.json({ success: false, error: 'No notification IDs provided' }, { status: 400 })
        }

        await prisma.notification.updateMany({
            where: { id: { in: parsedIds } },
            data: { isRead: true }
        })

        return NextResponse.json({ success: true, message: 'Notifications marked as read' })
    } catch (error) {
        console.error('Error marking notifications read:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
