import { getEnfantById, updateEnfant, deleteEnfant } from '@/lib/enfant'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
    const id = params.id
    const enfant = await getEnfantById(id)

    if (!enfant) {
        return NextResponse.json({ message: 'Enfant non trouvé' }, { status: 404 })
    }

    return NextResponse.json(enfant)
}

export async function PUT(request, { params }) {
    const id = params.id
    const data = await request.json()

    try {
        const updated = await updateEnfant(id, data)
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 400 })
    }
}

export async function DELETE(_, { params }) {
    const id = params.id

    try {
        await deleteEnfant(id)
        return NextResponse.json({ message: 'Enfant supprimé' })
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 400 })
    }
}
