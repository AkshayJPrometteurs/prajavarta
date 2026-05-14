import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - List subdivisions with pagination, search, and filter
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const isActive = searchParams.get('isActive')
        const districtId = searchParams.get('districtId')
        const skip = (page - 1) * limit

        const where = {
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { nameEnglish: { contains: search } },
                ]
            }),
            ...(isActive !== null && isActive !== undefined && isActive !== '' && {
                isActive: isActive === 'true'
            }),
            ...(districtId && { districtId: parseInt(districtId) })
        }

        const total = await prisma.subdivision.count({ where })

        const subdivisions = await prisma.subdivision.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                districtId: true,
                isActive: true,
                createdAt: true,
                district: {
                    select: { id: true, name: true, nameEnglish: true }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: subdivisions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// POST - Create new subdivision
export async function POST(request) {
    try {
        const { name, nameEnglish, districtId, isActive } = await request.json()

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Subdivision name is required' },
                { status: 400 }
            )
        }

        const subdivision = await prisma.subdivision.create({
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                districtId: districtId ? parseInt(districtId) : null,
                isActive: isActive !== false
            }
        })

        return NextResponse.json({
            success: true,
            data: subdivision,
            message: 'Subdivision created successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// PUT - Update subdivision
export async function PUT(request) {
    try {
        const { id, name, nameEnglish, districtId, isActive } = await request.json()

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Subdivision ID is required' },
                { status: 400 }
            )
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Subdivision name is required' },
                { status: 400 }
            )
        }

        const existing = await prisma.subdivision.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Subdivision not found' },
                { status: 404 }
            )
        }

        const subdivision = await prisma.subdivision.update({
            where: { id: parseInt(id) },
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                districtId: districtId ? parseInt(districtId) : null,
                isActive: isActive !== false
            }
        })

        return NextResponse.json({
            success: true,
            data: subdivision,
            message: 'Subdivision updated successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// DELETE - Delete subdivision
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Subdivision ID is required' },
                { status: 400 }
            )
        }

        const subdivision = await prisma.subdivision.findUnique({
            where: { id: parseInt(id) }
        })

        if (!subdivision) {
            return NextResponse.json(
                { success: false, error: 'Subdivision not found' },
                { status: 404 }
            )
        }

        await prisma.subdivision.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'Subdivision deleted successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
