'use client'

import { useEffect, useState } from 'react'
import EnfantCard from '@/components/EnfantCard'
import { UserPlus, Printer, Search, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import Can from "@/components/Can"

export default function DashboardPage() {
    const [groupedData, setGroupedData] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enfantRes, presenceRes] = await Promise.all([
                    fetch('/api/enfants'),
                    fetch('/api/presence'),
                ])

                const enfants = await enfantRes.json()
                const presences = await presenceRes.json()

                const grouped = enfants.reduce((acc, enfant) => {
                    acc[enfant.id_enfant] = { ...enfant, presences: [] }
                    return acc
                }, {})

                presences.forEach(({ enfant, jour, matin, apres_midi }) => {
                    const id = enfant?.id_enfant
                    if (grouped[id]) {
                        grouped[id].presences.push({
                            jour: jour?.jour_semaine,
                            matin,
                            apres_midi,
                        })
                    }
                })

                setGroupedData(grouped)
            } catch (error) {
                console.error('Erreur de chargement des données :', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const removeEnfantFromState = (id) => {
        setGroupedData(prev => {
            const updated = { ...prev }
            delete updated[id]
            return updated
        })
    }

    const handleDelete = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet enfant ?")) return
        try {
            const res = await fetch(`/api/enfants/${id}`, { method: 'DELETE' })
            if (res.ok) removeEnfantFromState(id)
            else alert("Échec de la suppression.")
        } catch (err) {
            console.error(err)
            alert("Une erreur s'est produite.")
        }
    }

    const handleArchive = async (id) => {
        try {
            const res = await fetch(`/api/enfants/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ est_archive: true }),
            })
            if (res.ok) removeEnfantFromState(id)
            else alert("Échec de l'archivage.")
        } catch (err) {
            console.error(err)
            alert("Une erreur s'est produite.")
        }
    }

    const filteredEnfants = Object.values(groupedData).filter(e =>
        !e.est_archive &&
        `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const buttonClass = "text-white px-4 py-2 rounded flex items-center gap-2"

    return (
        <div className="p-6 pt-20 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-center md:text-left">Liste des enfants</h1>

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
                <Can action="canCreate">
                    <Link href="/addEnfant" className={`${buttonClass} bg-green-600 hover:bg-green-700`}>
                        <UserPlus className="w-4 h-4" />
                        Ajouter un enfant
                    </Link>
                </Can>
                <button className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}>
                    <Printer className="w-4 h-4" />
                    Présence hebdomadaire
                </button>
                <button className={`${buttonClass} bg-indigo-600 hover:bg-indigo-700`}>
                    <Printer className="w-4 h-4" />
                    Total Présence
                </button>
            </div>
        </div>
    )
}
