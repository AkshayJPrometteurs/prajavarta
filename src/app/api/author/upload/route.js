import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { AUTHOR_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'
import { uploadToCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary'

function getTokenFromRequest(request) {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }
    return request.cookies.get(AUTHOR_AUTH_COOKIE_NAME)?.value || null
}

export async function POST(request) {
    try {
        const token = getTokenFromRequest(request)

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No token provided' },
                { status: 401 }
            )
        }

        const decoded = verifyToken(token)

        if (!decoded || decoded.role !== 'AUTHOR') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedMimes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Only JPEG, PNG, WebP, and GIF files are allowed' },
                { status: 400 }
            )
        }

        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'File size must be less than 5MB' },
                { status: 400 }
            )
        }

        const buffer = await file.arrayBuffer()
        const result = await uploadToCloudinary(Buffer.from(buffer), 'authors')
        const imageUrl = result.secure_url
        const publicId = extractPublicIdFromUrl(imageUrl) || result.public_id

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl,
            publicId
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
