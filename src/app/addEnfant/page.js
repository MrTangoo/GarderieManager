'use client'

import { useRouter } from 'next/navigation'
import EnfantForm from '@/components/EnfantForm'

export default function AddEnfantPage() {
    const router = useRouter()

    const handleAdd = async (formData) => {
        try {
            const res = await fetch('/api/enfants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prenom: formData.prenom,
                    nom: formData.nom,
                    age: formData.age,
                    adresse: formData.adresse,
                    telephone_parent: formData.telephone_parent,
                }),
            })

            if (!res.ok) throw new Error('Erreur lors de la création de l’enfant.')

            const newEnfant = await res.json()

            const presences = Object.entries(formData.presences || {})
                .filter(([_, value]) => value.matin || value.apres_midi)
                .map(([id_jour, value]) => ({
                    id_enfant: newEnfant.id_enfant,
                    id_jour,
                    matin: value.matin,
                    apres_midi: value.apres_midi,
                }))

            if (presences.length > 0) {
                await Promise.all(
                    presences.map((presence) =>
                        fetch('/api/presence', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(presence),
                        })
                    )
                )
            }

            router.push('/dashboard')
        } catch (err) {
            console.error(err)
            alert("Une erreur est survenue lors de l'ajout.")
        }
    }

    return (
        <div className="pt-24 px-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Ajouter un enfant</h1>
            <EnfantForm onSubmit={handleAdd} />
        </div>
    )
}
