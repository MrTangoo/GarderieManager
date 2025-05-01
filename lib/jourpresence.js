import { prisma } from './prisma.js'

export async function getAllJoursPresence() {
    return prisma.jourPresence.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export async function getJourPresenceById(id) {
    return prisma.jourPresence.findUnique({
        where: { id_jour: id },
    })
}

export async function createJourPresence(data) {
    return prisma.jourPresence.create({ data })
}

export async function updateJourPresence(id, data) {
    return prisma.jourPresence.update({
        where: { id_jour: id },
        data,
    })
}

export async function deleteJourPresence(id) {
    return prisma.jourPresence.delete({
        where: { id_jour: id },
    })
}
