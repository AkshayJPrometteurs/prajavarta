import { NextResponse } from 'next/server'
import { verifyPassword, verifyToken, hashPassword } from '@/lib/auth'
import { AUTHOR_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'
import prisma from '@/lib/prisma'

function getTokenFromRequest(request) {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7)
    }
    return request.cookies.get(AUTHOR_AUTH_COOKIE_NAME)?.value || null
}

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request)

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const decoded = verifyToken(token)

        if (!decoded || decoded.role !== 'AUTHOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId, role: 'AUTHOR' },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                email: true,
                designation: true,
                experience: true,
                bio: true,
                twitter: true,
                linkedin: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Author profile retrieved successfully',
            user
        })

    } catch (error) {
        console.error('Profile API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request) {
    try {
        const token = getTokenFromRequest(request)

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const decoded = verifyToken(token)

        if (!decoded || decoded.role !== 'AUTHOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            name,
            nameEnglish,
            email,
            designation,
            experience,
            bio,
            twitter,
            linkedin,
            image,
            currentPassword,
            newPassword
        } = body

        if (!name || !email) {
            return NextResponse.json(
                { success: false, error: 'Name and email are required' },
                { status: 400 }
            )
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId, role: 'AUTHOR' }
        })

        if (!currentUser) {
            return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 })
        }

        if (email !== currentUser.email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email }
            })
            if (existingEmail) {
                return NextResponse.json({ success: false, error: 'Email is already in use' }, { status: 409 })
            }
        }

        const updateData = {
            name: name.trim(),
            nameEnglish: nameEnglish?.trim() || null,
            email: email.trim(),
            designation: designation?.trim() || null,
            experience: experience?.trim() || null,
            bio: bio?.trim() || null,
            twitter: twitter?.trim() || null,
            linkedin: linkedin?.trim() || null,
            image: image?.trim() || null
        }

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { success: false, error: 'Current password is required to set a new password' },
                    { status: 400 }
                )
            }

            const validPassword = await verifyPassword(currentPassword, currentUser.passwordHash)
            if (!validPassword) {
                return NextResponse.json(
                    { success: false, error: 'Current password is incorrect' },
                    { status: 401 }
                )
            }

            if (newPassword.length < 6) {
                return NextResponse.json(
                    { success: false, error: 'New password must be at least 6 characters long' },
                    { status: 400 }
                )
            }

            updateData.passwordHash = await hashPassword(newPassword)
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                email: true,
                designation: true,
                experience: true,
                bio: true,
                twitter: true,
                linkedin: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        console.error('Error updating author profile:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
