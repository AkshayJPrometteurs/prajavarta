import { NextResponse } from 'next/server'
import { uploadToCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary'

const uploadFolders = {
    categories: 'categories',
    'main-advertisement-banner': 'main-advertisement-banner',
    news: 'news',
    authors: 'authors',
    settings: 'settings',
    users: 'users'
}

function getImageDimensions(buffer) {
    if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
        return {
            width: buffer.readUInt32BE(16),
            height: buffer.readUInt32BE(20)
        }
    }

    if (buffer.length >= 10 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
        const chunk = buffer.toString('ascii', 12, 16)

        if (chunk === 'VP8 ' && buffer.length >= 30) {
            return {
                width: buffer.readUInt16LE(26) & 0x3fff,
                height: buffer.readUInt16LE(28) & 0x3fff
            }
        }

        if (chunk === 'VP8L' && buffer.length >= 25) {
            const bits = buffer.readUInt32LE(21)
            return {
                width: (bits & 0x3fff) + 1,
                height: ((bits >> 14) & 0x3fff) + 1
            }
        }

        if (chunk === 'VP8X' && buffer.length >= 30) {
            return {
                width: 1 + buffer.readUIntLE(24, 3),
                height: 1 + buffer.readUIntLE(27, 3)
            }
        }
    }

    if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
        let offset = 2

        while (offset < buffer.length) {
            if (buffer[offset] !== 0xff || offset + 3 >= buffer.length) return null

            const marker = buffer[offset + 1]
            const length = buffer.readUInt16BE(offset + 2)

            if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
                return {
                    height: buffer.readUInt16BE(offset + 5),
                    width: buffer.readUInt16BE(offset + 7)
                }
            }

            offset += 2 + length
        }
    }

    return null
}

export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file')
        const folder = formData.get('folder') || 'categories'
        const expectedWidth = parseInt(formData.get('expectedWidth') || '0', 10)
        const expectedHeight = parseInt(formData.get('expectedHeight') || '0', 10)

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!uploadFolders[folder]) {
            return NextResponse.json(
                { success: false, error: 'Invalid upload folder' },
                { status: 400 }
            )
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, error: 'Only image files are allowed' },
                { status: 400 }
            )
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'File size should be less than 5MB' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        if (expectedWidth && expectedHeight) {
            const dimensions = getImageDimensions(buffer)

            if (!dimensions) {
                return NextResponse.json(
                    { success: false, error: 'Unable to verify image dimensions' },
                    { status: 400 }
                )
            }

            if (dimensions.width < expectedWidth || dimensions.height < expectedHeight) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Minimum image size must be ${expectedWidth}x${expectedHeight}px. Selected image is ${dimensions.width}x${dimensions.height}px`
                    },
                    { status: 400 }
                )
            }
        }

        const result = await uploadToCloudinary(buffer, uploadFolders[folder])
        const imageUrl = result.secure_url
        const publicId = result.public_id
        const imagePublicId = extractPublicIdFromUrl(imageUrl)

        return NextResponse.json({
            success: true,
            data: {
                path: imageUrl,
                url: imageUrl,
                filename: imagePublicId || publicId,
                publicId: imagePublicId || publicId
            },
            message: 'Image uploaded successfully'
        })
    } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}
