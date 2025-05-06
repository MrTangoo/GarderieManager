import { getEnfantById, updateEnfant, deleteEnfant } from '@/lib/enfant';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';

export async function GET(_, { params }) {
    try {
        const { id } = await params;
        const enfant = await getEnfantById(id);

        if (!enfant) {
            return NextResponse.json({ message: 'Enfant non trouvé' }, { status: 404 });
        }

        return NextResponse.json(enfant);
    } catch (error) {
        console.error('Erreur GET enfant :', error);
        return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
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
        const updated = await updateEnfant(id, data);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Erreur mise à jour enfant :', error);
        return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 400 });
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
        await deleteEnfant(id);
        return NextResponse.json({ message: 'Enfant supprimé' });
    } catch (error) {
        console.error('Erreur suppression enfant :', error);
        return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 400 });
    }
}
