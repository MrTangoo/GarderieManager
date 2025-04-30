import { prisma } from './prisma.js'

export async function getAllEnfants() {
    const enfants = await prisma.enfant.findMany()
    return enfants.sort((a, b) => a.nom.localeCompare(b.nom))
}

export async function getEnfantById(id) {
    return prisma.enfant.findUnique({
        where: { id_enfant: id },
    })
}

export async function createEnfant(data) {
    return prisma.enfant.create({ data })
}

export async function updateEnfant(id, data) {
    return prisma.enfant.update({
        where: { id_enfant: id },
        data,
    })
}

export async function deleteEnfant(id) {
    return prisma.enfant.delete({
        where: { id_enfant: id },
    })
}
