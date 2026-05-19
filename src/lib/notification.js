import prisma from '@/lib/prisma'

export async function createNotification({ title, message = null, type = null, userId = null, authorId = null, metadata = null }) {
    return prisma.notification.create({
        data: {
            title,
            message,
            type,
            userId,
            authorId,
            metadata
        }
    })
}

export async function markNotificationsRead(ids = []) {
    const parsedIds = Array.isArray(ids) ? ids.filter((id) => typeof id === 'number') : []
    if (parsedIds.length === 0) return null

    return prisma.notification.updateMany({
        where: { id: { in: parsedIds } },
        data: { isRead: true }
    })
}
