import {updatePresence, deletePresencesByEnfantId, getPresencesByEnfantId} from '@/lib/presence'
import { NextResponse } from 'next/server'

export async function GET(request, context) {
    try {
        const { id } = await context.params

        if (!id) {
            return NextResponse.json({ message: 'ID manquant' }, { status: 400 })
        }

        const presences = await getPresencesByEnfantId(id)
        return NextResponse.json(presences)
    } catch (error) {
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
    }
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
    const { id } = await params;

    try {
        await deletePresencesByEnfantId(id);
        return NextResponse.json({ message: 'Présences supprimées' });
    } catch (error) {
        console.error('Erreur suppression :', error);
        return NextResponse.json({ message: 'Erreur suppression' }, { status: 500 });
    }
}


