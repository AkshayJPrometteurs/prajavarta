import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - List districts with pagination, search, and filter
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const isActive = searchParams.get('isActive')
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
            })
        }

        const total = await prisma.district.count({ where })

        const districts = await prisma.district.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                isActive: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            success: true,
            data: districts,
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

// POST - Create new district
export async function POST(request) {
    try {
        const { name, nameEnglish, isActive } = await request.json()

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'District name is required' },
                { status: 400 }
            )
        }

        const district = await prisma.district.create({
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                isActive: isActive !== false
            }
        })

        return NextResponse.json({
            success: true,
            data: district,
            message: 'District created successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// PUT - Update district
export async function PUT(request) {
    try {
        const { id, name, nameEnglish, isActive } = await request.json()

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'District ID is required' },
                { status: 400 }
            )
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'District name is required' },
                { status: 400 }
            )
        }

        const existing = await prisma.district.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'District not found' },
                { status: 404 }
            )
        }

        const district = await prisma.district.update({
            where: { id: parseInt(id) },
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                isActive: isActive !== false
            }
        })

        return NextResponse.json({
            success: true,
            data: district,
            message: 'District updated successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// DELETE - Delete district
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'District ID is required' },
                { status: 400 }
            )
        }

        const district = await prisma.district.findUnique({
            where: { id: parseInt(id) }
        })

        if (!district) {
            return NextResponse.json(
                { success: false, error: 'District not found' },
                { status: 404 }
            )
        }

        await prisma.district.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'District deleted successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
