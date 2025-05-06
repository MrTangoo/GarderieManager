import { updatePresence, deletePresencesByEnfantId, getPresencesByEnfantId } from '@/lib/presence';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: 'ID manquant' }, { status: 400 });
        }

        const presences = await getPresencesByEnfantId(id);
        return NextResponse.json(presences);
    } catch (error) {
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Non authentifié', { status: 401 });
    }

    try {
        const { id } = await params;
        const data = await request.json();

        const updated = await updatePresence(id, data);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour' },
            { status: 400 }
        );
    }
}

export async function DELETE(_, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Non authentifié', { status: 401 });
    }

    try {
        const { id } = await params;
        await deletePresencesByEnfantId(id);
        return NextResponse.json({ message: 'Présences supprimées' });
    } catch (error) {
        console.error('Erreur suppression :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}
