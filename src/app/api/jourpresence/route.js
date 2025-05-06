import { getAllJoursPresence, createJourPresence } from '@/lib/jourpresence';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';

export async function GET() {
    try {
        const jours = await getAllJoursPresence();
        return NextResponse.json(jours);
    } catch (error) {
        console.error('Erreur récupération jours :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la récupération des jours' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Non authentifié', { status: 401 });
    }

    if (!can(session.user, 'canCreate')) {
        return new NextResponse('Non autorisé', { status: 403 });
    }

    try {
        const data = await request.json();
        const jour = await createJourPresence(data);
        return NextResponse.json(jour, { status: 201 });
    } catch (error) {
        console.error('Erreur création jour :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la création' },
            { status: 400 }
        );
    }
}
