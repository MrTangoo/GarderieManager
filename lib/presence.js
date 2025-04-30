import { prisma } from './prisma.js'

export async function getAllPresences() {
    return prisma.presence.findMany({
        include: {
            enfant: true,
            jour: true,
        },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getPresenceById(id) {
    return prisma.presence.findUnique({
        where: { id_presence: id },
        include: {
            enfant: true,
            jour: true,
        },
    })
}

export async function createPresence(data) {
    return prisma.presence.create({ data })
}

export async function updatePresence(id, data) {
    return prisma.presence.update({
        where: { id_presence: id },
        data,
    })
}

export async function deletePresence(id) {
    return prisma.presence.delete({
        where: { id_presence: id },
    })
}
