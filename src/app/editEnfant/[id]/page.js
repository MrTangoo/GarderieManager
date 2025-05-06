'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import EnfantForm from '@/components/EnfantForm'
import { toast } from 'react-hot-toast'

export default function EditEnfantPage() {
    const [enfant, setEnfant] = useState(null)
    const router = useRouter()
    const { id } = useParams()

    useEffect(() => {
        const fetchEnfant = async () => {
            try {
                const res = await fetch(`/api/enfants/${id}`)
                if (!res.ok) throw new Error('Erreur serveur')

                const data = await res.json()
                setEnfant(data)
            } catch (err) {
                console.error('Erreur chargement enfant :', err)
                toast.error("Erreur lors du chargement de l'enfant.")
                router.push('/dashboard')
            }
        }

        fetchEnfant()
    }, [id, router])

    const handleUpdate = async (formData) => {
        try {
            const { presences, ...enfantData } = formData

            const updateRes = await fetch(`/api/enfants/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enfantData),
            })

            if (!updateRes.ok) throw new Error('Échec mise à jour enfant')

            await fetch(`/api/presence/${id}`, { method: 'DELETE' })

            const presenceRequests = Object.entries(presences)
                .filter(([_, p]) => p.matin || p.apres_midi)
                .map(([id_jour, p]) =>
                    fetch('/api/presence', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id_enfant: id,
                            id_jour,
                            matin: p.matin ?? false,
                            apres_midi: p.apres_midi ?? false,
                        }),
                    })
                )

            await Promise.all(presenceRequests)

            toast.success("L'enfant a été mis à jour avec succès.")
            router.push('/dashboard')
        } catch (err) {
            console.error('Erreur mise à jour :', err)
            toast.error("Échec de la mise à jour de l'enfant.")
        }
    }

    return (
        <div className="pt-24 px-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Modifier l&apos;enfant</h1>
            <EnfantForm initialData={enfant} onSubmit={handleUpdate} />
        </div>
    )
}
