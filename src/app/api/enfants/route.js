import { getAllEnfants, createEnfant } from '@/lib/enfant';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';

export async function GET() {
    try {
        const enfants = await getAllEnfants();
        return NextResponse.json(enfants);
    } catch (error) {
        console.error('Erreur récupération enfants :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la récupération des enfants' },
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
        const enfant = await createEnfant(data);
        return NextResponse.json(enfant, { status: 201 });
    } catch (error) {
        console.error('Erreur création enfant :', error);
        return NextResponse.json(
            { message: 'Erreur lors de la création de l\'enfant' },
            { status: 400 }
        );
    }
}
