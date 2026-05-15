import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

export async function POST(request) {
    try {
        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
        }

        const { authorId } = await request.json()
        if (!authorId) {
            return NextResponse.json({ success: false, error: 'Author ID is required' }, { status: 400 })
        }

        const userId = decoded.userId
        const parsedAuthorId = parseInt(authorId)

        // Raw SQL fallback for follow/unfollow to bypass client sync issues
        const followCheck = await prisma.$queryRaw`SELECT id FROM author_followers WHERE author_id = ${parsedAuthorId} AND user_id = ${userId} LIMIT 1`
        
        if (followCheck.length > 0) {
            // Unfollow
            const followId = followCheck[0].id
            await prisma.$executeRaw`DELETE FROM author_followers WHERE id = ${followId}`
            return NextResponse.json({ success: true, following: false, message: 'Unfollowed successfully' })
        } else {
            // Follow
            await prisma.$executeRaw`INSERT INTO author_followers (user_id, author_id, created_at) VALUES (${userId}, ${parsedAuthorId}, NOW())`
            return NextResponse.json({ success: true, following: true, message: 'Followed successfully' })
        }

    } catch (error) {
        console.error('Error in follow/unfollow:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
