import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'

// GET - list or single user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const user = await prisma.user.findUnique({ where: { id: parseInt(id) }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, image: true } })
            if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
            return NextResponse.json({ success: true, data: user })
        }

        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const isActive = searchParams.get('isActive')
        const skip = (page - 1) * limit

        const where = {
            role: 'USER',
            ...(search && {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } }
                ]
            }),
            ...(isActive !== null && isActive !== undefined && { isActive: isActive === 'true' })
        }

        const total = await prisma.user.count({ where })
        const users = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, image: true }
        })

        return NextResponse.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// POST - create user
export async function POST(request) {
    try {
        const body = await request.json()
        const { name, email, password, role, image } = body
        if (!email || !password) return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 409 })

        const hashed = await hashPassword(password)
        const user = await prisma.user.create({ data: { name: name || null, email, passwordHash: hashed, role: role || 'USER', image: image || null }, select: { id: true, name: true, email: true, role: true, isActive: true, image: true } })
        return NextResponse.json({ success: true, data: user, message: 'User created' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// PUT - update user
export async function PUT(request) {
    try {
        const body = await request.json()
        const { id, name, email, password, role, isActive, image } = body
        if (!id) return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })

        const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } })
        if (!existing) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

        const updateData = { name: name || null, email: email || existing.email, role: role || existing.role, isActive: typeof isActive === 'boolean' ? isActive : existing.isActive, image: image ?? existing.image }
        if (password) updateData.passwordHash = await hashPassword(password)

        const user = await prisma.user.update({ where: { id: parseInt(id) }, data: updateData, select: { id: true, name: true, email: true, role: true, isActive: true, image: true } })
        return NextResponse.json({ success: true, data: user, message: 'User updated' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// DELETE - delete user
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })

        const existing = await prisma.user.findUnique({ where: { id: parseInt(id) } })
        if (!existing) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

        await prisma.user.delete({ where: { id: parseInt(id) } })
        return NextResponse.json({ success: true, message: 'User deleted' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
