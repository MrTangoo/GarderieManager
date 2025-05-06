'use client'

import { useRouter } from 'next/navigation'
import EnfantForm from '@/components/EnfantForm'
import { toast } from 'react-hot-toast'

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
                    matin: value.matin ?? false,
                    apres_midi: value.apres_midi ?? false,
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

            toast.success('Enfant ajouté avec succès !')
            router.push('/dashboard')
        } catch (err) {
            console.error(err)
            toast.error("Une erreur est survenue lors de l'ajout.")
        }
    }

    return (
        <div className="pt-24 px-4 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                Ajouter un enfant
            </h1>
            <EnfantForm onSubmit={handleAdd} />
        </div>
    )
}
