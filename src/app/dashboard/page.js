'use client'

import { useEffect, useState } from 'react'
import EnfantCard from '@/components/EnfantCard'
import { UserPlus, Printer, Search, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import Can from "@/components/Can"
import { toast } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const HebdoPrint = dynamic(() => import('@/components/HebdoPrint'), { ssr: false })
const TotalPrint = dynamic(() => import('@/components/TotalPrint'), { ssr: false })

export default function DashboardPage() {
    const [groupedData, setGroupedData] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [printMode, setPrintMode] = useState(null) // 'hebdo' ou 'total'

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
            if (res.ok) {
                removeEnfantFromState(id)
                toast.success("Enfant supprimé avec succès.")
            } else {
                toast.error("Échec de la suppression.")
            }
        } catch (err) {
            console.error(err)
            toast.error("Une erreur est survenue.")
        }
    }

    const handleArchive = async (id) => {
        try {
            const res = await fetch(`/api/enfants/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ est_archive: true }),
            })
            if (res.ok) {
                removeEnfantFromState(id)
                toast.success("Enfant archivé avec succès.")
            } else {
                toast.error("Échec de l'archivage.")
            }
        } catch (err) {
            console.error(err)
            toast.error("Une erreur est survenue.")
        }
    }

    const filteredEnfants = Object.values(groupedData).filter(e =>
        !e.est_archive &&
        `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const buttonClass =
        "text-white px-4 py-2 rounded-xl shadow-sm font-medium flex items-center gap-2 transition-colors"

    return (
        <div className="p-6 md:pt-20 pt-25 max-w-5xl mx-auto space-y-8 h-full bg-[#f5fbff]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-800 text-center md:text-left">
                    Liste des enfants
                </h1>

                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-200">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Rechercher un enfant"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-sm text-gray-700"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <LoaderCircle className="w-6 h-6 animate-spin text-gray-500" />
                </div>
            ) : (
                <>
                    <div className="max-h-[697px] overflow-y-auto pr-2 space-y-6">
                        {filteredEnfants.map((enfant) => (
                            <EnfantCard
                                key={enfant.id_enfant}
                                enfant={enfant}
                                onDelete={handleDelete}
                                onArchive={handleArchive}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 px-4">
                        <Can action="canCreate">
                            <Link
                                href="/addEnfant"
                                className={`${buttonClass} bg-green-700 hover:bg-green-800 w-full sm:w-auto justify-center text-center`}
                            >
                                <UserPlus className="w-4 h-4" />
                                Ajouter un enfant
                            </Link>
                        </Can>
                        <button
                            onClick={() => setPrintMode('hebdo')}
                            className={`${buttonClass} bg-cyan-500 hover:bg-cyan-700 w-full sm:w-auto justify-center text-center`}
                        >
                            <Printer className="w-4 h-4" />
                            Présence hebdomadaire
                        </button>

                        <button
                            onClick={() => setPrintMode('total')}
                            className={`${buttonClass} bg-blue-500 hover:bg-blue-600 w-full sm:w-auto justify-center text-center`}
                        >
                            <Printer className="w-4 h-4" />
                            Présence totale
                        </button>
                    </div>
                </>
            )}

            {printMode === 'hebdo' && <HebdoPrint onDone={() => setPrintMode(null)} />}
            {printMode === 'total' && <TotalPrint onDone={() => setPrintMode(null)} />}
        </div>
    )
}
