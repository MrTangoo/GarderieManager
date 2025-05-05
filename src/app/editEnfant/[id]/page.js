'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import EnfantForm from '@/components/EnfantForm'

export default function EditEnfantPage() {
    const [enfant, setEnfant] = useState(null)
    const router = useRouter()
    const { id } = useParams()

    useEffect(() => {
        const fetchEnfant = async () => {
            try {
                const res = await fetch(`/api/enfants/${id}`)
                if (!res.ok) throw new Error()

                const data = await res.json()
                setEnfant(data)
            } catch {
                alert("Erreur lors du chargement de l'enfant.")
                router.push('/dashboard')
            }
        }

        fetchEnfant()
    }, [id, router])

    const handleUpdate = async (formData) => {
        const { presences, ...enfantData } = formData

        const updateRes = await fetch(`/api/enfants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enfantData),
        })

        if (!updateRes.ok) {
            alert("Échec de la mise à jour.")
            return
        }

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
        router.push('/dashboard')
    }

    return (
        <div className="pt-24 px-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Modifier l&apos;enfant</h1>
            <EnfantForm initialData={enfant} onSubmit={handleUpdate} />
        </div>
    )
}
