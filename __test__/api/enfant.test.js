import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '@/app/api/enfants/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/enfants/[id]/route'
import { getAllEnfants, createEnfant, getEnfantById, updateEnfant, deleteEnfant } from '@/lib/enfant'
import { getServerSession } from 'next-auth'

vi.mock('@/lib/enfant', () => ({
    getAllEnfants: vi.fn(),
    createEnfant: vi.fn(),
    getEnfantById: vi.fn(),
    updateEnfant: vi.fn(),
    deleteEnfant: vi.fn(),
}))

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}))

const mockEnfant = {
    id_enfant: '1',
    nom: 'Dupont',
    prenom: 'Jean',
    age: 5,
    adresse: 'chemin du raffort 23',
    telephone_parent: '1231231212',
    est_archive: false,
    createdAt: new Date().toISOString(),
}

describe('API /api/enfants', () => {
    it('GET - récupère les enfants avec status 200', async () => {
        getAllEnfants.mockResolvedValue([mockEnfant])
        const res = await GET()
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toHaveLength(1)
        expect(data[0].nom).toBe('Dupont')
        expect(getAllEnfants).toHaveBeenCalledOnce()
    })

    it('POST - crée un enfant si authentifié et autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })

        const newEnfant = {
            nom: 'Martin',
            prenom: 'Lucie',
            age: 4,
            adresse: 'chemin du raffort 14',
            telephone_parent: '2342343434',
        }

        createEnfant.mockResolvedValue({
            ...newEnfant,
            id_enfant: '2',
            est_archive: false,
            createdAt: new Date().toISOString(),
        })

        const req = { json: () => newEnfant }
        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(201)
        expect(data.nom).toBe('Martin')
        expect(data.telephone_parent).toBe('2342343434')
    })

    it('POST - retourne 401 si non authentifié', async () => {
        getServerSession.mockResolvedValue(null)

        const req = { json: () => ({ nom: 'Toto', prenom: 'Test', age: 4, adresse: 'Rue A', telephone_parent: '000' }) }
        const res = await POST(req)

        expect(res.status).toBe(401)
    })

it('POST - retourne 403 si utilisateur non autorisé', async () => {
    getServerSession.mockResolvedValue({ user: { role: 'PARENT' } }) // PARENT n’a pas canCreate

    const req = { json: () => ({ nom: 'Toto', prenom: 'Test', age: 4, adresse: 'Rue A', telephone_parent: '000' }) }
    const res = await POST(req)

    expect(res.status).toBe(403)
    expect(await res.text()).toMatch(/non autorisé/i)
})
})


describe('API /api/enfants/[id]', () => {
    it('GET - retourne un enfant existant', async () => {
        getEnfantById.mockResolvedValue(mockEnfant)
        const res = await GET_BY_ID(null, { params: { id: '1' } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.nom).toBe('Dupont')
        expect(data.age).toBe(5)
    })

    it('GET - retourne 404 si enfant non trouvé', async () => {
        getEnfantById.mockResolvedValue(null)

        const res = await GET_BY_ID(null, { params: { id: 'invalide-id' } })
        expect(res.status).toBe(404)
        const data = await res.json()
        expect(data.message).toMatch(/non trouvé/i)
    })

    it('PUT - met à jour un enfant si authentifié', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })

        const updatePayload = { nom: 'Modifié', age: 6 }
        const updated = { ...mockEnfant, ...updatePayload }

        updateEnfant.mockResolvedValue(updated)

        const req = { json: () => updatePayload }
        const res = await PUT(req, { params: { id: '1' } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.nom).toBe('Modifié')
        expect(data.age).toBe(6)
    })

    it('PUT - retourne 401 si utilisateur non authentifié', async () => {
        getServerSession.mockResolvedValue(null)

        const req = { json: () => ({ nom: 'Nouveau nom' }) }
        const res = await PUT(req, { params: { id: '1' } })

        expect(res.status).toBe(401)
        expect(await res.text()).toMatch(/non authentifié/i)
    })


    it('DELETE - supprime un enfant si autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
        deleteEnfant.mockResolvedValue(true)

        const res = await DELETE(null, { params: { id: '1' } })

        expect(res.status).toBe(200)
    })

    it('DELETE - retourne 401 si non authentifié', async () => {
        getServerSession.mockResolvedValue(null)

        const res = await DELETE(null, { params: { id: '1' } })
        expect(res.status).toBe(401)
    })

    it('DELETE - retourne 403 si utilisateur non autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'PARENT' } }) // PARENT n’a pas canDelete

        const res = await DELETE(null, { params: { id: '1' } })
        expect(res.status).toBe(403)
    })
})
