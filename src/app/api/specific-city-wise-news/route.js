import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const districtSlug = searchParams.get('district') || 'Pune'
        const limit = parseInt(searchParams.get('limit')) || 5

        const district = await prisma.district.findFirst({
            where: {
                OR: [
                    { nameEnglish: { equals: districtSlug } },
                    { name: { equals: districtSlug } }
                ]
            }
        })

        if (!district) {
            return NextResponse.json({
                success: false,
                error: 'District not found',
                data: { district: null, news: [] }
            }, { status: 404 })
        }

        const news = await prisma.news.findMany({
            where: {
                isActive: true,
                districtId: district.id
            },
            orderBy: { publishedDate: 'desc' },
            take: limit,
            include: {
                category: true,
                district: true,
                location: true
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                district: {
                    id: district.id,
                    name: district.name,
                    nameEnglish: district.nameEnglish
                },
                news
            }
        })
    } catch (error) {
        console.error('Error fetching Pune updates:', error)
        return NextResponse.json(
            { success: false, error: error.message, data: { district: null, news: [] } },
            { status: 500 }
        )
    }
}
