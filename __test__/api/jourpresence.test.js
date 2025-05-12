import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '@/app/api/jourpresence/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/jourpresence/[id]/route'
import { getAllJoursPresence, createJourPresence, getJourPresenceById, updateJourPresence, deleteJourPresence } from '@/lib/jourpresence'
import { getServerSession } from 'next-auth'

vi.mock('@/lib/jourpresence', () => ({
    getAllJoursPresence: vi.fn(),
    createJourPresence: vi.fn(),
    getJourPresenceById: vi.fn(),
    updateJourPresence: vi.fn(),
    deleteJourPresence: vi.fn(),
}))

vi.mock('next-auth', () => ({
    getServerSession: vi.fn()
}))

const mockJour = {
    id_jour: '1',
    jour_semaine: 'lundi',
    createdAt: new Date().toISOString()
}

describe('API /api/jourpresence', () => {
    it('GET - récupère les jours avec status 200', async () => {
        getAllJoursPresence.mockResolvedValue([mockJour])
        const res = await GET()
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toHaveLength(1)
    })

    it('POST - crée un jour si autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
        const req = { json: () => ({ jour_semaine: 'mardi' }) }
        createJourPresence.mockResolvedValue({ ...mockJour, jour_semaine: 'mardi' })

        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(201)
        expect(data.jour_semaine).toBe('mardi')
    })

    it('POST - retourne 401 si non authentifié', async () => {
        getServerSession.mockResolvedValue(null)
        const req = { json: () => ({ jour_semaine: 'mardi' }) }
        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('POST - retourne 403 si non autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'PARENT' } }) // n’a pas canCreate
        const req = { json: () => ({ jour_semaine: 'mardi' }) }
        const res = await POST(req)
        expect(res.status).toBe(403)
    })
})

describe('API /api/jourpresence/[id]', () => {
    it('GET - retourne un jour existant', async () => {
        getJourPresenceById.mockResolvedValue(mockJour)
        const res = await GET_BY_ID(null, { params: { id: '1' } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.jour_semaine).toBe('lundi')
    })

    it('GET - retourne 404 si jour non trouvé', async () => {
        getJourPresenceById.mockResolvedValue(null)
        const res = await GET_BY_ID(null, { params: { id: 'x' } })
        expect(res.status).toBe(404)
    })

    it('PUT - met à jour un jour si autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
        updateJourPresence.mockResolvedValue({ ...mockJour, jour_semaine: 'vendredi' })
        const req = { json: () => ({ jour_semaine: 'vendredi' }) }
        const res = await PUT(req, { params: { id: '1' } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.jour_semaine).toBe('vendredi')
    })

    it('PUT - retourne 401 si non authentifié', async () => {
        getServerSession.mockResolvedValue(null)
        const req = { json: () => ({ jour_semaine: 'jeudi' }) }
        const res = await PUT(req, { params: { id: '1' } })

        expect(res.status).toBe(401)
    })

    it('PUT - retourne 403 si utilisateur non autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'PARENT' } }) // n’a pas canEdit
        const req = { json: () => ({ jour_semaine: 'jeudi' }) }
        const res = await PUT(req, { params: { id: '1' } })

        expect(res.status).toBe(403)
    })



    it('DELETE - supprime un jour si autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
        deleteJourPresence.mockResolvedValue(true)
        const res = await DELETE(null, { params: { id: '1' } })

        expect(res.status).toBe(200)
    })

    it('DELETE - retourne 401 si non authentifié', async () => {
        getServerSession.mockResolvedValue(null)
        const res = await DELETE(null, { params: { id: '1' } })

        expect(res.status).toBe(401)
    })

    it('DELETE - retourne 403 si utilisateur non autorisé', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'PARENT' } }) // n’a pas canDelete
        const res = await DELETE(null, { params: { id: '1' } })

        expect(res.status).toBe(403)
    })
})
