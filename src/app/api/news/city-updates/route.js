import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const districtSlug = searchParams.get('district')
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const skip = (page - 1) * limit

        let where = { isActive: true }
        
        if (districtSlug) {
            const district = await prisma.district.findFirst({
                where: {
                    nameEnglish: {
                        equals: districtSlug
                    }
                }
            })

            if (district) {
                where.districtId = district.id
            } else {
                // If district slug not found, maybe it's the Marathi name
                const districtMarathi = await prisma.district.findFirst({
                    where: {
                        name: districtSlug
                    }
                })
                if (districtMarathi) {
                    where.districtId = districtMarathi.id
                }
            }
        }

        const totalItems = await prisma.news.count({ where })

        const news = await prisma.news.findMany({
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

        // Fetch district info for the UI
        let districtInfo = null
        if (districtSlug) {
            districtInfo = await prisma.district.findFirst({
                where: {
                    OR: [
                        { nameEnglish: districtSlug },
                        { name: districtSlug }
                    ]
                }
            })
        }

        return NextResponse.json({
            success: true,
            data: news,
            district: districtInfo,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        })

    } catch (error) {
        console.error('Error fetching city updates:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
