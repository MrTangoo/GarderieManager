import { prisma } from '@/lib/prisma'
import { updateJourPresence, deleteJourPresence } from '@/lib/jourpresence'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
    const id = params.id

    const jour = await prisma.jourPresence.findUnique({
        where: { id_jour: id },
    })

    if (!jour) {
        return NextResponse.json({ message: 'Jour de présence non trouvé' }, { status: 404 })
    }

    return NextResponse.json(jour)
}

export async function PUT(request, { params }) {
    const id = params.id
    const data = await request.json()

    try {
        const updated = await updateJourPresence(id, data)
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 400 })
    }
}

export async function DELETE(_, { params }) {
    const id = params.id

    try {
        await deleteJourPresence(id)
        return NextResponse.json({ message: 'Jour supprimé' })
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 400 })
    }
}
