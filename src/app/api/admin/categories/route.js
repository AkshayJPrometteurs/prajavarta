import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Generate slug from name
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
}

// GET - List categories with pagination, search, and filter
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const isActive = searchParams.get('isActive')
        const skip = (page - 1) * limit

        // Build filter conditions
        const where = {
            slug: { not: 'home-page' },
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { nameEnglish: { contains: search } },
                ]
            }),
            ...(isActive !== null && isActive !== undefined && {
                isActive: isActive === 'true'
            })
        }

        // Get total count for pagination
        const total = await prisma.category.count({ where })

        // Get categories with pagination
        const categories = await prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: { sortOrder: 'asc' },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                slug: true,
                description: true,
                image: true,
                isActive: true,
                sortOrder: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            success: true,
            data: categories,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// POST - Create new category
export async function POST(request) {
    try {
        const { name, nameEnglish, name_english, description, image, isActive, sortOrder } = await request.json()
        const englishName = (nameEnglish || name_english || '').trim()

        // Validation
        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Category name is required' },
                { status: 400 }
            )
        }

        const slug = generateSlug(englishName || name)

        // Check if slug already exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug }
        })

        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 400 }
            )
        }

        const existingCategorySequence = await prisma.category.findMany({
            where: { sortOrder: sortOrder || 0 }
        })

        if (existingCategorySequence.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Category with this sort order already exists' },
                { status: 400 }
            )
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                nameEnglish: englishName || null,
                slug,
                description: description || null,
                image: image || null,
                isActive: isActive !== false,
                sortOrder: sortOrder || 0
            }
        })

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category created successfully'
        })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// PUT - Update category
export async function PUT(request) {
    try {
        const { id, name, nameEnglish, name_english, description, image, isActive, sortOrder } = await request.json()
        const englishName = (nameEnglish || name_english || '').trim()

        // Validation
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Category ID is required' },
                { status: 400 }
            )
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Category name is required' },
                { status: 400 }
            )
        }

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingCategory) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            )
        }

        const slug = generateSlug(englishName || name)

        // Check if new slug is already taken by another category
        const slugExists = await prisma.category.findFirst({
            where: {
                slug,
                id: { not: parseInt(id) }
            }
        })

        if (slugExists) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 400 }
            )
        }

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name: name.trim(),
                nameEnglish: englishName || null,
                slug,
                description: description || null,
                image: image || null,
                isActive: isActive !== false,
                sortOrder: sortOrder || 0
            }
        })

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category updated successfully'
        })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

// DELETE - Delete category
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Category ID is required' },
                { status: 400 }
            )
        }

        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        })

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            )
        }

        await prisma.category.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
