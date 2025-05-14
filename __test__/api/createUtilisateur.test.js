
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUtilisateur } from '@/lib/utilisateur'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        utilisateur: {
            findUnique: vi.fn(),
            create: vi.fn(),
        }
    }
}))

// Mock bcrypt
vi.mock('bcryptjs', () => {
    return {
        default: {
            hash: vi.fn((pw, salt) => Promise.resolve('hashed-' + pw)),
        },
    }
})



describe('createUtilisateur()', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('hash correctement le mot de passe avant enregistrement', async () => {
        prisma.utilisateur.findUnique.mockResolvedValue(null) // pas encore en base

        const userInput = {
            login: 'testuser',
            mot_de_passe: 'monSuperMotDePasse',
            role: 'ADMIN',
        }

        prisma.utilisateur.create.mockResolvedValue({
            id_utilisateur: 'abc123',
            login: userInput.login,
            role: userInput.role,
        })

        const user = await createUtilisateur(userInput)

        expect(bcrypt.hash).toHaveBeenCalledWith('monSuperMotDePasse', 10)
        expect(prisma.utilisateur.create).toHaveBeenCalledWith({
            data: {
                login: userInput.login,
                mot_de_passe: 'hashed-monSuperMotDePasse',
                role: 'ADMIN',
            }
        })

        expect(user).toEqual({
            id: 'abc123',
            login: 'testuser',
            role: 'ADMIN',
        })
    })
})
