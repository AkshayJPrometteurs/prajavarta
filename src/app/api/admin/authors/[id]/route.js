import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const { id } = await params
        const author = await prisma.user.findUnique({
            where: { id: parseInt(id), role: 'AUTHOR' },
        })

        if (!author) {
            return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: author })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, nameEnglish, role, experience, bio, image, twitter, linkedin, email, isActive } = body
        
        const author = await prisma.user.update({
            where: { id: parseInt(id), role: 'AUTHOR' },
            data: {
                name,
                nameEnglish,
                designation: role,
                experience,
                bio,
                image,
                twitter,
                linkedin,
                email,
                isActive
            }
        })

        return NextResponse.json({ success: true, data: author })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params
        
        // Check if author has news
        const newsCount = await prisma.news.count({
            where: { authorId: parseInt(id) }
        })

        if (newsCount > 0) {
            // Soft delete or block hard delete
            await prisma.user.update({
                where: { id: parseInt(id), role: 'AUTHOR' },
                data: { isActive: false }
            })
            return NextResponse.json({ success: true, message: 'Author deactivated as they have associated news.' })
        }

        await prisma.user.delete({
            where: { id: parseInt(id), role: 'AUTHOR' }
        })

        return NextResponse.json({ success: true, message: 'Author deleted successfully' })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
