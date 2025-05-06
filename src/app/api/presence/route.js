import { getAllPresences, createPresence } from '@/lib/presence';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const presences = await getAllPresences();
        return NextResponse.json(presences);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des présences' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Non authentifié', { status: 401 });
    }

    try {
        const data = await request.json();
        const presence = await createPresence(data);
        return NextResponse.json(presence, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la création de la présence' },
            { status: 500 }
        );
    }
}
