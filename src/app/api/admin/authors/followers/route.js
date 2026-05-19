import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')?.trim() || ''
        const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
        const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
        const skip = (page - 1) * limit

        const where = search
            ? {
                OR: [
                    { user: { name: { contains: search } } },
                    { user: { email: { contains: search } } },
                    { author: { name: { contains: search } } },
                    { author: { email: { contains: search } } },
                ]
            }
            : {}

        const [totalItems, followers] = await Promise.all([
            prisma.authorFollower.count({ where }),
            prisma.authorFollower.findMany({
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
            data: followers,
            pagination: {
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1),
                currentPage: page,
                limit
            }
        })
    } catch (error) {
        console.error('Error fetching author followers:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const idParam = searchParams.get('id')
        const id = parseInt(idParam || '', 10)

        if (!id) {
            return NextResponse.json({ success: false, error: 'Follower record ID is required' }, { status: 400 })
        }

        await prisma.authorFollower.delete({ where: { id } })

        return NextResponse.json({ success: true, message: 'Successfully removed follow record' })
    } catch (error) {
        console.error('Error deleting author follower:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
