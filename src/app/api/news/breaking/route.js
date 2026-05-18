import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 15

    const news = await prisma.news.findMany({
      where: { isActive: true, isBreakingNews: true },
      orderBy: { publishedDate: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedDate: true
      }
    })

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching breaking news:', error)
    return NextResponse.json({ success: false, error: error.message, data: [] }, { status: 500 })
  }
}
