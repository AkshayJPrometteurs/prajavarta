import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const skip = (page - 1) * limit

    let categoryInfo = null
    let where = { isActive: true }

    if (categorySlug) {
      categoryInfo = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: categorySlug },
            { name: decodeURIComponent(categorySlug) }
          ]
        }
      })

      if (categoryInfo) {
        where.OR = [
          { categoryId: categoryInfo.id },
          {
            categoryIds: {
              contains: String(categoryInfo.id)
            }
          }
        ]
      }
    }

    const totalItems = await prisma.news.count({ where })

    let news = await prisma.news.findMany({
      where,
      orderBy: { publishedDate: 'desc' },
      skip,
      take: limit,
      include: {
        district: true,
        location: true,
        category: true
      }
    })

    if (!categoryInfo) {
      news = shuffleArray(news)
    }

    return NextResponse.json({
      success: true,
      data: news,
      category: categoryInfo
        ? {
            id: categoryInfo.id,
            name: categoryInfo.name,
            nameEnglish: categoryInfo.nameEnglish,
            slug: categoryInfo.slug
          }
        : null,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit
      }
    })
  } catch (error) {
    console.error('Error fetching latest news:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
