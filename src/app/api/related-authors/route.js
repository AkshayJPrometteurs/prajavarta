import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

const authorSelect = {
    id: true,
    name: true,
    nameEnglish: true,
    role: true,
    image: true,
    bio: true,
    designation: true,
    experience: true,
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const rawAuthorName = searchParams.get('authorName')?.trim()
        const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
        const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24', 10), 1), 48)
        const skip = (page - 1) * limit

        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
        const decoded = token ? verifyToken(token) : null
        const currentUserId = decoded?.userId || null

        let currentAuthor = null

        if (rawAuthorName) {
            const authorName = decodeURIComponent(rawAuthorName)
            currentAuthor = await prisma.user.findFirst({
                where: {
                    role: 'AUTHOR',
                    isActive: true,
                    OR: [
                        { nameEnglish: { contains: authorName } },
                        { name: { contains: authorName } }
                    ]
                },
                select: authorSelect
            })
        }

        const where = {
            role: 'AUTHOR',
            isActive: true,
            ...(currentAuthor ? { id: { not: currentAuthor.id } } : {})
        }

        const [totalItems, authors] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
                select: authorSelect
            })
        ])

        let authorsWithFollow = authors.map((author) => ({ ...author, isFollowing: false }))

        if (currentUserId && authors.length > 0) {
            const followRecords = await prisma.authorFollower.findMany({
                where: {
                    userId: currentUserId,
                    authorId: { in: authors.map((item) => item.id) }
                },
                select: { authorId: true }
            })

            const followedAuthorIds = new Set(followRecords.map((item) => item.authorId))
            authorsWithFollow = authors.map((author) => ({
                ...author,
                isFollowing: followedAuthorIds.has(author.id)
            }))
        }

        return NextResponse.json({
            success: true,
            data: {
                currentAuthor,
                authors: authorsWithFollow,
                pagination: {
                    totalItems,
                    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
                    currentPage: page,
                    limit
                }
            }
        })
    } catch (error) {
        console.error('Error fetching related authors:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
