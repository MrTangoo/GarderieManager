import { getJourPresenceById, updateJourPresence, deleteJourPresence } from '@/lib/jourpresence';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';

export async function GET(_, { params }) {
    try {
        const { id } = await params;

        const jour = await getJourPresenceById(id);

        if (!jour) {
            return NextResponse.json(
                { message: 'Jour de présence non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(jour);
    } catch (error) {
        console.error('Erreur GET jour :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Non authentifié', { status: 401 });
    }

    if (!can(session.user, 'canEdit')) {
        return new NextResponse('Non autorisé', { status: 403 });
    }

    try {
        const { id } = await params;
        const data = await request.json();

        const updated = await updateJourPresence(id, data);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Erreur PUT jour :', error);
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

    if (!can(session.user, 'canDelete')) {
        return new NextResponse('Non autorisé', { status: 403 });
    }

    try {
        const { id } = await params;
        await deleteJourPresence(id);
        return NextResponse.json({ message: 'Jour supprimé' });
    } catch (error) {
        console.error('Erreur DELETE jour :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la suppression' },
            { status: 400 }
        );
    }
}
