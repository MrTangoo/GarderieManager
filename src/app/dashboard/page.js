'use client'

import { useEffect, useState } from 'react'
import EnfantCard from '@/components/EnfantCard'
import { UserPlus } from 'lucide-react';
import { Printer } from 'lucide-react';


export default function DashboardPage() {
    const [groupedData, setGroupedData] = useState({})

    useEffect(() => {
        fetch('/api/presence')
            .then((res) => res.json())
            .then((data) => {
                const grouped = {}
                data.forEach((presence) => {
                    const enfantId = presence.enfant.id_enfant
                    if (!grouped[enfantId]) {
                        grouped[enfantId] = {
                            ...presence.enfant,
                            presences: [],
                        }
                    }
                    grouped[enfantId].presences.push({
                        jour: presence.jour.jour_semaine,
                        matin: presence.matin,
                        apres_midi: presence.apres_midi,
                    })
                })
                setGroupedData(grouped)
            })
    }, [])

    const handleDelete = async (id) => {
        const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')
        if (!confirmed) return

        const res = await fetch(`/api/enfants/${id}`, {
            method: 'DELETE',
        })

        if (res.ok) {
            setGroupedData((prev) => {
                const updated = { ...prev }
                delete updated[id]
                return updated
            })
        } else {
            alert("Échec de la suppression.")
        }
    }

    const handleArchive = async (id) => {
        const res = await fetch(`/api/enfants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ est_archive: true }),
        })

        if (res.ok) {
            setGroupedData((prev) => {
                const updated = { ...prev }
                delete updated[id]
                return updated
            })
        } else {
            alert("Échec de l'archivage.")
        }
    }


    return (
        <div className="p-6 pt-16">
            <h1 className="text-2xl font-bold mb-6">Liste des enfants et leurs présences</h1>

            {Object.values(groupedData)
                .filter((enfant) => !enfant.est_archive)
                .map((enfant) => (
                    <EnfantCard key={enfant.id_enfant} enfant={enfant} onDelete={handleDelete} onArchive={handleArchive}/>
                ))}

            <div className="flex gap-2">
                <button className="bg-green-500 text-white p-2 rounded inline-flex"><UserPlus/>Ajouter un enfant</button>
                <button className="bg-blue-500 text-white p-2 rounded inline-flex"><Printer />Présence hebdomadaire</button>
                <button  className="bg-blue-500 text-white p-2 rounded inline-flex"><Printer />Total Présence</button>
            </div>

        </div>
    )
}
