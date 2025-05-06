'use client'

import { useEffect, useState } from 'react'
import { CirclePlus, LoaderCircle, Pencil } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { permissions } from '@/lib/permissions'

export default function EnfantForm({ initialData = null, onSubmit }) {
    const [formData, setFormData] = useState(null)
    const [jours, setJours] = useState([])
    const [loading, setLoading] = useState(true)

    const { data: session } = useSession()
    const role = session?.user?.role
    const canEdit = permissions[role]?.canEdit ?? false
    const canEditPresence = permissions[role]?.canEditPresence ?? false

    useEffect(() => {
        const fetchPresencesAndJours = async () => {
            try {
                const [joursRes, presRes] = await Promise.all([
                    fetch('/api/jourpresence'),
                    initialData ? fetch(`/api/presence/${initialData.id_enfant}`) : null,
                ])

                const joursData = await joursRes.json()
                const orderedDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
                joursData.sort((a, b) => orderedDays.indexOf(a.jour_semaine) - orderedDays.indexOf(b.jour_semaine))
                setJours(joursData)

                const presMap = {}
                if (initialData && presRes) {
                    const enfantPresences = await presRes.json()
                    enfantPresences.forEach(p => {
                        presMap[p.id_jour] = { matin: p.matin, apres_midi: p.apres_midi }
                    })

                    setFormData({
                        prenom: initialData.prenom,
                        nom: initialData.nom,
                        age: initialData.age,
                        adresse: initialData.adresse,
                        telephone_parent: initialData.telephone_parent,
                        presences: presMap,
                    })
                } else {
                    joursData.forEach(j => {
                        presMap[j.id_jour] = { matin: false, apres_midi: false }
                    })

                    setFormData({
                        prenom: '',
                        nom: '',
                        age: '',
                        adresse: '',
                        telephone_parent: '',
                        presences: presMap,
                    })
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPresencesAndJours()
    }, [initialData])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePresenceChange = (jourId, field, value) => {
        setFormData(prev => ({
            ...prev,
            presences: {
                ...prev.presences,
                [jourId]: {
                    ...prev.presences[jourId],
                    [field]: value,
                },
            },
        }))
    }

    const getInputClass = () =>
        `border p-2 rounded ${!canEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit(formData)
    }

    if (loading || !formData) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoaderCircle className="animate-spin text-gray-500 w-6 h-6" />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md border p-6 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    value={formData.prenom}
                    onChange={e => handleChange('prenom', e.target.value)}
                    placeholder="Prénom"
                    className={getInputClass()}
                    required
                    disabled={!canEdit}
                />
                <input
                    value={formData.nom}
                    onChange={e => handleChange('nom', e.target.value)}
                    placeholder="Nom"
                    className={getInputClass()}
                    required
                    disabled={!canEdit}
                />
                <input
                    type="number"
                    value={formData.age === 0 ? '' : formData.age}
                    onChange={e =>
                        handleChange('age', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="Âge"
                    className={getInputClass()}
                    required
                    disabled={!canEdit}
                    min="1"
                />
                <input
                    type="tel"
                    value={formData.telephone_parent}
                    onChange={e => handleChange('telephone_parent', e.target.value)}
                    placeholder="Téléphone parent"
                    className={getInputClass()}
                    required
                    disabled={!canEdit}
                    pattern="^\+?[0-9]{10,15}$"
                    title="Veuillez entrer un numéro valide (10 à 15 chiffres, avec un '+' possible)"
                />
            </div>

            <input
                value={formData.adresse}
                onChange={e => handleChange('adresse', e.target.value)}
                placeholder="Adresse"
                className={getInputClass()}
                required
                disabled={!canEdit}
            />

            <div>
                <h3 className="font-semibold text-xl mb-4 border-b pb-2">Présences hebdomadaires</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {jours.map(jour => (
                        <div key={jour.id_jour} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                            <div className="text-lg capitalize font-medium text-gray-700 mb-3">
                                {jour.jour_semaine}
                            </div>
                            <div className="flex gap-4">
                                {['matin', 'apres_midi'].map(period => (
                                    <label key={period} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 cursor-pointer"
                                            checked={formData.presences?.[jour.id_jour]?.[period] || false}
                                            onChange={e => handlePresenceChange(jour.id_jour, period, e.target.checked)}
                                            disabled={!canEditPresence}
                                        />
                                        <span className="text-gray-600">{period === 'matin' ? 'Matin' : 'Après-midi'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow flex items-center gap-2">
                    {initialData ? (
                        <><Pencil className="w-4 h-4" /> Modifier</>) : (<><CirclePlus className="w-4 h-4" /> Ajouter</>)}
                </button>
            </div>
        </form>
    )
}
