import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - List tehsils with pagination, search, and filter
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const isActive = searchParams.get('isActive')
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
            ...(isActive !== null && isActive !== undefined && isActive !== '' && {
                isActive: isActive === 'true'
            }),
            ...(districtId && { districtId: parseInt(districtId) }),
            ...(subdivisionId && { subdivisionId: parseInt(subdivisionId) })
        }

        const total = await prisma.tehsil.count({ where })

        const tehsils = await prisma.tehsil.findMany({
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
                isActive: true,
                createdAt: true,
                district: {
                    select: { id: true, name: true, nameEnglish: true }
                },
                subdivision: {
                    select: { id: true, name: true, nameEnglish: true }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: tehsils,
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

// POST - Create new tehsil
export async function POST(request) {
    try {
        const { name, nameEnglish, districtId, subdivisionId, isActive } = await request.json()

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Tehsil name is required' },
                { status: 400 }
            )
        }

        const tehsil = await prisma.tehsil.create({
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                districtId: districtId ? parseInt(districtId) : null,
                subdivisionId: subdivisionId ? parseInt(subdivisionId) : null,
                isActive: isActive !== false
            }
        })

        return NextResponse.json({
            success: true,
            data: tehsil,
            message: 'Tehsil created successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// PUT - Update tehsil
export async function PUT(request) {
    try {
        const { id, name, nameEnglish, districtId, subdivisionId, isActive } = await request.json()

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Tehsil ID is required' },
                { status: 400 }
            )
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Tehsil name is required' },
                { status: 400 }
            )
        }

        const existing = await prisma.tehsil.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Tehsil not found' },
                { status: 404 }
            )
        }

        const tehsil = await prisma.tehsil.update({
            where: { id: parseInt(id) },
            data: {
                name: name.trim(),
                nameEnglish: nameEnglish?.trim() || null,
                districtId: districtId ? parseInt(districtId) : null,
                subdivisionId: subdivisionId ? parseInt(subdivisionId) : null,
                isActive: isActive !== false
            }
        })

        return NextResponse.json({
            success: true,
            data: tehsil,
            message: 'Tehsil updated successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// DELETE - Delete tehsil
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Tehsil ID is required' },
                { status: 400 }
            )
        }

        const tehsil = await prisma.tehsil.findUnique({
            where: { id: parseInt(id) }
        })

        if (!tehsil) {
            return NextResponse.json(
                { success: false, error: 'Tehsil not found' },
                { status: 404 }
            )
        }

        await prisma.tehsil.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'Tehsil deleted successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
