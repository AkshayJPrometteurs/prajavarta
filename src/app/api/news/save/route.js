import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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

    const { newsId } = await request.json()
    if (!newsId) {
      return NextResponse.json({ success: false, error: 'newsId is required' }, { status: 400 })
    }

    const parsedNewsId = Number(newsId)
    if (Number.isNaN(parsedNewsId)) {
      return NextResponse.json({ success: false, error: 'newsId must be a number' }, { status: 400 })
    }

    const article = await prisma.news.findUnique({ where: { id: parsedNewsId } })
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    const existingSave = await prisma.savedArticle.findUnique({
      where: {
        userId_newsId: {
          userId: decoded.userId,
          newsId: parsedNewsId,
        },
      },
    })

    if (existingSave) {
      await prisma.savedArticle.delete({ where: { id: existingSave.id } })
      return NextResponse.json({ success: true, saved: false, message: 'Article removed from saved items' })
    }

    await prisma.savedArticle.create({
      data: {
        userId: decoded.userId,
        newsId: parsedNewsId,
      },
    })

    return NextResponse.json({ success: true, saved: true, message: 'Article saved successfully' })
  } catch (error) {
    console.error('Error saving article:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
