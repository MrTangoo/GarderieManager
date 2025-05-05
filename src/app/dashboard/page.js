'use client'

import { useEffect, useState } from 'react'
import EnfantCard from '@/components/EnfantCard'
import { UserPlus, Printer, Search, LoaderCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const [groupedData, setGroupedData] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPresences = async () => {
            try {
                const res = await fetch('/api/presence')
                const data = await res.json()

                const grouped = {}
                for (const p of data) {
                    const id = p.enfant.id_enfant
                    if (!grouped[id]) {
                        grouped[id] = { ...p.enfant, presences: [] }
                    }
                    grouped[id].presences.push({
                        jour: p.jour.jour_semaine,
                        matin: p.matin,
                        apres_midi: p.apres_midi,
                    })
                }

                setGroupedData(grouped)
            } catch (e) {
                console.error('Erreur de chargement des données :', e)
            } finally {
                setLoading(false)
            }
        }

        fetchPresences()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet enfant ?")) return

        const res = await fetch(`/api/enfants/${id}`, { method: 'DELETE' })
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

    const filteredEnfants = Object.values(groupedData)
        .filter((e) => !e.est_archive)
        .filter((e) =>
            `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
        )

    return (
        <div className="p-6 pt-20 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-center md:text-left">
                    Liste des enfants
                </h1>
                <div className="flex items-center border rounded-md px-3 py-2 w-full md:w-72">
                    <Search className="w-4 h-4 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Rechercher un enfant"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <LoaderCircle className="w-6 h-6 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredEnfants.map((enfant) => (
                        <EnfantCard
                            key={enfant.id_enfant}
                            enfant={enfant}
                            onDelete={handleDelete}
                            onArchive={handleArchive}
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
                <Link
                    href="/addEnfant"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Ajouter un enfant
                </Link>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Présence hebdomadaire
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Total Présence
                </button>
            </div>
        </div>
    )
}
