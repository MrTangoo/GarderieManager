import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function createUtilisateur({ login, mot_de_passe, role = 'PARENT' }) {
    const existingUser = await prisma.utilisateur.findUnique({ where: { login } })
    if (existingUser) {
        throw new Error('Ce login est déjà utilisé')
    }

    const hashed = await bcrypt.hash(mot_de_passe, 10)

    const utilisateur = await prisma.utilisateur.create({
        data: {
            login,
            mot_de_passe: hashed,
            role,
        },
    })

    return {
        id: utilisateur.id_utilisateur,
        login: utilisateur.login,
        role: utilisateur.role,
    }
}
