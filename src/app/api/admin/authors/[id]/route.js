import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const { id } = await params
        const author = await prisma.author.findUnique({
            where: { id: parseInt(id) }
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
        
        const author = await prisma.author.update({
            where: { id: parseInt(id) },
            data: body
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
            await prisma.author.update({
                where: { id: parseInt(id) },
                data: { isActive: false }
            })
            return NextResponse.json({ success: true, message: 'Author deactivated as they have associated news.' })
        }

        await prisma.author.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ success: true, message: 'Author deleted successfully' })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
