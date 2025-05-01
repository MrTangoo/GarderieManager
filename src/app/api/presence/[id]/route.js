import {  getPresenceById, updatePresence, deletePresence } from '@/lib/presence'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
    const id = params.id

    const presence = await getPresenceById(id)

    if (!presence) {
        return NextResponse.json({ message: 'Présence non trouvée' }, { status: 404 })
    }

    return NextResponse.json(presence)
}


export async function PUT(request, { params }) {
    const id = params.id
    const data = await request.json()

    try {
        const updated = await updatePresence(id, data)
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 400 })
    }
}

export async function DELETE(_, { params }) {
    const id = params.id

    try {
        await deletePresence(id)
        return NextResponse.json({ message: 'Présence supprimée' })
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 400 })
    }
}
