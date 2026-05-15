import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const isActive = searchParams.get('isActive')
        
        let where = {}
        if (isActive !== null) {
            where.isActive = isActive === 'true'
        }

        const authors = await prisma.author.findMany({
            where,
            orderBy: { name: 'asc' }
        })

        return NextResponse.json({ success: true, data: authors })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, nameEnglish, role, experience, bio, image, twitter, linkedin, email } = body

        if (!name) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
        }

        const author = await prisma.author.create({
            data: {
                name,
                nameEnglish,
                role,
                experience,
                bio,
                image,
                twitter,
                linkedin,
                email
            }
        })

        return NextResponse.json({ success: true, data: author })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
