import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '@/app/api/presence/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/presence/[id]/route'
import { getAllPresences, getPresencesByEnfantId, updatePresence, deletePresencesByEnfantId, createPresence } from '@/lib/presence'
import { getServerSession } from 'next-auth'

vi.mock('@/lib/presence', () => ({
    getAllPresences: vi.fn(),
    getPresencesByEnfantId: vi.fn(),
    updatePresence: vi.fn(),
    deletePresencesByEnfantId: vi.fn(),
    createPresence: vi.fn(),
}))

vi.mock('next-auth', () => ({
    getServerSession: vi.fn()
}))

const mockPresence = {
    id_presence: '1',
    id_enfant: 'e1',
    id_jour: 'j1',
    matin: true,
    apres_midi: false,
    enfant: { id_enfant: 'e1', nom: 'Dupont', prenom: 'Jean' },
    jour: { id_jour: 'j1', jour_semaine: 'lundi' },
    createdAt: new Date().toISOString()
}

describe('API /api/presence', () => {
    it('GET - récupère toutes les présences', async () => {
        getAllPresences.mockResolvedValue([mockPresence])
        const res = await GET()
        const data = await res.json()
        expect(res.status).toBe(200)
        expect(data).toHaveLength(1)
        expect(data[0].matin).toBe(true)
    })

    it('POST - crée une présence si authentifié', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
        const payload = { id_enfant: 'e1', id_jour: 'j1', matin: true, apres_midi: false }
        createPresence.mockResolvedValue({ ...payload, id_presence: '1' })

        const req = { json: () => payload }
        const res = await POST(req)
        const data = await res.json()
        expect(res.status).toBe(201)
        expect(data.id_presence).toBeDefined()
    })

    it('POST - retourne 401 si non authentifié', async () => {
        getServerSession.mockResolvedValue(null)
        const payload = { id_enfant: 'e1', id_jour: 'j1', matin: true, apres_midi: false }
        createPresence.mockResolvedValue({ ...payload, id_presence: '1' })

        const req = { json: () => payload }
        const res = await POST(req)
        expect(res.status).toBe(401)
    })
})

describe('API /api/presence/[id]', () => {
    it('GET - récupère les présences d un enfant', async () => {
    getPresencesByEnfantId.mockResolvedValue([{ id_jour: 'j1', matin: true, apres_midi: false }])
    const res = await GET_BY_ID(null, { params: { id: 'e1' } })
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data[0].matin).toBe(true)
})

it('GET - retourne 400 si id manquant', async () => {
    const res = await GET_BY_ID(null, { params: {} })
    expect(res.status).toBe(400)
})

it('PUT - met à jour une présence si authentifié', async () => {
    getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
    updatePresence.mockResolvedValue({ ...mockPresence, matin: false })

    const req = { json: () => ({ matin: false }) }
    const res = await PUT(req, { params: { id: '1' } })
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.matin).toBe(false)
})

it('PUT - retourne 401 si non authentifié', async () => {
    getServerSession.mockResolvedValue(null)
    const req = { json: () => ({ matin: true }) }
    const res = await PUT(req, { params: { id: '1' } })
    expect(res.status).toBe(401)
})

it('DELETE - supprime toutes les présences liées à un enfant si authentifié', async () => {
    getServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
    deletePresencesByEnfantId.mockResolvedValue(true)
    const res = await DELETE(null, { params: { id: 'e1' } })
    expect(res.status).toBe(200)
})

it('DELETE - retourne 401 si non authentifié', async () => {
    getServerSession.mockResolvedValue(null)
    const res = await DELETE(null, { params: { id: 'e1' } })
    expect(res.status).toBe(401)
})
})