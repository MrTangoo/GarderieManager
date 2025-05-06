import { NextResponse } from 'next/server'
import { createUtilisateur } from '@/lib/utilisateur'

export async function POST(request) {
    try {
        const { login, mot_de_passe, role } = await request.json()

        if (!login || !mot_de_passe) {
            return NextResponse.json(
                { message: 'Login et mot de passe requis' },
                { status: 400 }
            )
        }

        const utilisateur = await createUtilisateur({ login, mot_de_passe, role })

        return NextResponse.json(
            { message: 'Utilisateur créé avec succès', utilisateur },
            { status: 201 }
        )
    } catch (error) {
        console.error('[REGISTER_ERROR]', error)

        const isConflict = error.message?.toLowerCase().includes('déjà utilisé')
        return NextResponse.json(
            { message: error.message || 'Erreur serveur' },
            { status: isConflict ? 409 : 500 }
        )
    }
}
