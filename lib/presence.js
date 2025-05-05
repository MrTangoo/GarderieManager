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

export async function getPresencesByEnfantId(id_enfant) {
    return prisma.presence.findMany({
        where: { id_enfant },
        select: {
            id_jour: true,
            matin: true,
            apres_midi: true,
        },
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

export async function deletePresencesByEnfantId(id_enfant) {
    return prisma.presence.deleteMany({
        where: { id_enfant }
    })
}
