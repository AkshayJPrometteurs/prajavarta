import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

function normalizeTag(value = '') {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
}

function decodeParam(value = '') {
    let decoded = String(value)

    for (let i = 0; i < 5; i++) {
        try {
            const next = decodeURIComponent(decoded)

            if (next === decoded) {
                break
            }

            decoded = next
        } catch (error) {
            break
        }
    }

    return decoded.trim()
}

function parseTags(tagsString) {
    if (!tagsString) return []

    return String(tagsString)
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
}

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params

        const slugArray = resolvedParams?.slug || []

        const slug = slugArray[0]

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tag is required'
                },
                {
                    status: 400
                }
            )
        }

        const tagName = decodeParam(slug)

        const exactTag = normalizeTag(tagName)

        console.log('Decoded Tag:', tagName)

        // Fetch all active news
        const rawNews = await prisma.news.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                publishedDate: 'desc'
            },
            include: {
                category: true,
                author: true
            }
        })

        // Filter by tag
        const matchingNews = rawNews.filter(news => {
            const tags = parseTags(news.tags).map(normalizeTag)

            return tags.includes(exactTag)
        })

        // Related Tags
        const relatedTags = [
            ...new Set(
                matchingNews
                    .flatMap(news => parseTags(news.tags))
                    .map(tag => tag.trim())
                    .filter(
                        tag =>
                            normalizeTag(tag) !== exactTag
                    )
            )
        ].slice(0, 12)

        // Hero
        const heroNews = matchingNews[0] || null

        // Latest
        const latestNews = matchingNews.slice(0, 10)

        // Most Read
        const mostRead = [...matchingNews]
            .sort(
                (a, b) =>
                    (b.viewCount || 0) -
                    (a.viewCount || 0)
            )
            .slice(0, 5)

        return NextResponse.json({
            success: true,

            data: {
                meta: {
                    tag: tagName,
                    totalNews: matchingNews.length,
                    lastUpdated:
                        matchingNews?.[0]
                            ?.publishedDate ||
                        matchingNews?.[0]
                            ?.createdAt ||
                        null
                },

                hero: heroNews,

                latestNews,

                mostRead,

                relatedTags
            }
        })
    } catch (error) {
        console.error(
            'Error fetching tag page:',
            error
        )

        return NextResponse.json(
            {
                success: false,
                error:
                    error?.message ||
                    'Something went wrong'
            },
            {
                status: 500
            }
        )
    }
}