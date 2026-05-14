import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - List locations with pagination and search
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const districtId = searchParams.get('districtId')
        const subdivisionId = searchParams.get('subdivisionId')
        const skip = (page - 1) * limit

        const where = {
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { nameEnglish: { contains: search } },
                ]
            }),
            ...(districtId && { districtId: parseInt(districtId) }),
            ...(subdivisionId && { subdivisionId: parseInt(subdivisionId) })
        }

        const total = await prisma.location.count({ where })

        const locations = await prisma.location.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                districtId: true,
                subdivisionId: true,
                groupLink: true,
                createdAt: true,
                district: { select: { id: true, name: true, nameEnglish: true } },
                subdivision: { select: { id: true, name: true, nameEnglish: true } }
            }
        })

        return NextResponse.json({
            success: true,
            data: locations,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// POST - Create new location
export async function POST(request) {
    try {
        const { name, nameEnglish, districtId, subdivisionId, groupLink } = await request.json()

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Location name is required' }, { status: 400 })
        }

        const location = await prisma.location.create({
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                districtId: districtId ? parseInt(districtId) : null,
                subdivisionId: subdivisionId ? parseInt(subdivisionId) : null,
                groupLink: groupLink?.trim() || null
            }
        })

        return NextResponse.json({ success: true, data: location, message: 'Location created successfully' })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// PUT - Update location
export async function PUT(request) {
    try {
        const { id, name, nameEnglish, districtId, subdivisionId, groupLink } = await request.json()

        if (!id) return NextResponse.json({ success: false, error: 'Location ID is required' }, { status: 400 })
        if (!name || name.trim().length === 0) return NextResponse.json({ success: false, error: 'Location name is required' }, { status: 400 })

        const existing = await prisma.location.findUnique({ where: { id: parseInt(id) } })
        if (!existing) return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 })

        const location = await prisma.location.update({
            where: { id: parseInt(id) },
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                districtId: districtId ? parseInt(districtId) : null,
                subdivisionId: subdivisionId ? parseInt(subdivisionId) : null,
                groupLink: groupLink?.trim() || null
            }
        })

        return NextResponse.json({ success: true, data: location, message: 'Location updated successfully' })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// DELETE - Delete location
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ success: false, error: 'Location ID is required' }, { status: 400 })

        const location = await prisma.location.findUnique({ where: { id: parseInt(id) } })
        if (!location) return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 })

        await prisma.location.delete({ where: { id: parseInt(id) } })
        return NextResponse.json({ success: true, message: 'Location deleted successfully' })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
