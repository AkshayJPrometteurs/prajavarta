import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { join } from 'path'

function generateSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
}

function toInt(value) {
    if (value === null || value === undefined || value === '') return null
    const parsed = parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
}

function toDate(value) {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

async function buildUniqueSlug(title, idToExclude = null) {
    const baseSlug = generateSlug(title) || `news-${Date.now()}`
    let slug = baseSlug
    let counter = 1

    while (true) {
        const existing = await prisma.news.findFirst({
            where: {
                slug,
                ...(idToExclude && { id: { not: idToExclude } })
            },
            select: { id: true }
        })

        if (!existing) return slug

        slug = `${baseSlug}-${counter}`
        counter += 1
    }
}

const newsInclude = {
    category: {
        select: {
            id: true,
            name: true,
            nameEnglish: true
        }
    },
    district: true,
    subdivision: true,
    tehsil: true,
    galleryImages: true
}

function buildPayload(body) {
    return {
        newsType: body.newsType || 'Image',
        ownerType: body.ownerType || 'ADMIN',
        title: body.title?.trim(),
        summary: body.summary?.trim() || null,
        description: body.description?.trim() || null,
        language: body.language || 'Marathi',
        featuredImage: body.featuredImage || null,
        galleryImage: body.galleryImage || null,
        newsUrl: body.newsUrl?.trim() || null,
        tags: body.tags?.trim() || null,
        sendNotification: body.sendNotification === true,
        publishedDate: toDate(body.publishedDate),
        ...(body.createdAt && { createdAt: toDate(body.createdAt) }),
        isBreakingNews: body.priority === 'Breaking',
        isTrendingNews: body.priority === 'Trending',
        isMiniTrendingNews: body.priority === 'Mini_Trending',
        videoId: body.videoId?.trim() || null,
        videoUrl: body.videoUrl?.trim() || null,
        isActive: body.isActive !== false,
        authorId: toInt(body.authorId),
        categoryId: toInt(body.categoryId),
        categoryIds: Array.isArray(body.categoryIds) && body.categoryIds.length > 0
            ? body.categoryIds.join(',')
            : null,
        districtId: toInt(body.districtId),
        subdivisionId: toInt(body.subdivisionId),
        tehsilId: toInt(body.tehsilId)
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const news = await prisma.news.findUnique({
                where: { id: parseInt(id, 10) },
                include: newsInclude
            })

            if (!news) {
                return NextResponse.json(
                    { success: false, error: 'News not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ success: true, data: news })
        }

        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '12', 10)
        const search = searchParams.get('search') || ''
        const ownerType = searchParams.get('ownerType') || 'ADMIN'
        const categoryId = toInt(searchParams.get('categoryId'))
        const isActive = searchParams.get('isActive')
        const skip = (page - 1) * limit

        const where = {
            ownerType,
            ...(search && {
                OR: [
                    { title: { contains: search } },
                    { summary: { contains: search } },
                    { tags: { contains: search } }
                ]
            }),
            ...(categoryId && { categoryId }),
            ...(isActive !== null && isActive !== undefined && {
                isActive: isActive === 'true'
            })
        }

        const [total, news] = await Promise.all([
            prisma.news.count({ where }),
            prisma.news.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: newsInclude
            })
        ])

        return NextResponse.json({
            success: true,
            data: news,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        const payload = buildPayload(body)

        if (!payload.title) {
            return NextResponse.json(
                { success: false, error: 'News title is required' },
                { status: 400 }
            )
        }

        const news = await prisma.news.create({
            data: {
                ...payload,
                slug: await buildUniqueSlug(payload.title),
                galleryImages: {
                    create: Array.isArray(body.galleryImages)
                        ? body.galleryImages.map(url => ({ imageUrl: url }))
                        : []
                }
            },
            include: newsInclude
        })

        return NextResponse.json({
            success: true,
            data: news,
            message: 'News created successfully'
        })
    } catch (error) {
        console.error('Error creating news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    try {
        const body = await request.json()
        const id = toInt(body.id)
        const payload = buildPayload(body)

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'News ID is required' },
                { status: 400 }
            )
        }

        if (!payload.title) {
            return NextResponse.json(
                { success: false, error: 'News title is required' },
                { status: 400 }
            )
        }

        const existingNews = await prisma.news.findUnique({ where: { id } })

        if (!existingNews) {
            return NextResponse.json(
                { success: false, error: 'News not found' },
                { status: 404 }
            )
        }

        const news = await prisma.news.update({
            where: { id },
            data: {
                ...payload,
                slug: await buildUniqueSlug(payload.title, id),
                galleryImages: {
                    deleteMany: {},
                    create: Array.isArray(body.galleryImages)
                        ? body.galleryImages.map(url => ({ imageUrl: url }))
                        : []
                }
            },
            include: newsInclude
        })

        return NextResponse.json({
            success: true,
            data: news,
            message: 'News updated successfully'
        })
    } catch (error) {
        console.error('Error updating news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function PATCH(request) {
    try {
        const { ids, action, isActive } = await request.json()
        const parsedIds = Array.isArray(ids)
            ? ids.map((id) => parseInt(id, 10)).filter(Boolean)
            : []

        if (parsedIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Select at least one news item' },
                { status: 400 }
            )
        }

        if (action === 'delete') {
            const newsItems = await prisma.news.findMany({
                where: { id: { in: parsedIds } },
                include: { galleryImages: true }
            })

            const deleteFile = async (filePath) => {
                if (!filePath || !filePath.startsWith('/uploads/')) return
                const absolutePath = join(process.cwd(), 'public', filePath)
                try {
                    if (existsSync(absolutePath)) {
                        await unlink(absolutePath)
                    }
                } catch (err) {
                    console.error(`Error deleting file ${absolutePath}:`, err)
                }
            }

            for (const news of newsItems) {
                if (news.featuredImage) await deleteFile(news.featuredImage)
                if (news.galleryImage) await deleteFile(news.galleryImage)
                if (news.galleryImages?.length > 0) {
                    for (const img of news.galleryImages) {
                        if (img.imageUrl) await deleteFile(img.imageUrl)
                    }
                }
            }

            await prisma.news.deleteMany({
                where: { id: { in: parsedIds } }
            })
        } else if (action === 'approve') {
            await prisma.news.updateMany({
                where: { id: { in: parsedIds } },
                data: { isActive: true, ownerType: 'REPORTER' }
            })
        } else if (action === 'reject') {
            await prisma.news.updateMany({
                where: { id: { in: parsedIds } },
                data: { isActive: false, ownerType: 'REPORTER' }
            })
        } else {
            await prisma.news.updateMany({
                where: { id: { in: parsedIds } },
                data: { isActive: action === 'enable' ? true : action === 'disable' ? false : isActive }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Selected news updated successfully'
        })
    } catch (error) {
        console.error('Error bulk updating news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = toInt(searchParams.get('id'))

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'News ID is required' },
                { status: 400 }
            )
        }

        const news = await prisma.news.findUnique({
            where: { id },
            include: { galleryImages: true }
        })

        if (!news) {
            return NextResponse.json(
                { success: false, error: 'News not found' },
                { status: 404 }
            )
        }

        const deleteFile = async (filePath) => {
            if (!filePath || !filePath.startsWith('/uploads/')) return
            const absolutePath = join(process.cwd(), 'public', filePath)
            try {
                if (existsSync(absolutePath)) {
                    await unlink(absolutePath)
                }
            } catch (err) {
                console.error(`Error deleting file ${absolutePath}:`, err)
            }
        }

        if (news.featuredImage) await deleteFile(news.featuredImage)
        if (news.galleryImage) await deleteFile(news.galleryImage)
        if (news.galleryImages?.length > 0) {
            for (const img of news.galleryImages) {
                if (img.imageUrl) await deleteFile(img.imageUrl)
            }
        }

        await prisma.news.delete({ where: { id } })

        return NextResponse.json({
            success: true,
            message: 'News deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting news:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
