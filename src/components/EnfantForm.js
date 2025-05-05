'use client'

import { useEffect, useState } from 'react'
import { CirclePlus, LoaderCircle, Pencil  } from 'lucide-react'

export default function EnfantForm({ initialData = null, onSubmit }) {
    const [formData, setFormData] = useState(null)
    const [jours, setJours] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const [joursRes, presRes] = await Promise.all([
                fetch('/api/jourpresence'),
                initialData ? fetch(`/api/presence/${initialData.id_enfant}`) : null,
            ])

            const joursData = await joursRes.json()
            const ordre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
            joursData.sort((a, b) => ordre.indexOf(a.jour_semaine) - ordre.indexOf(b.jour_semaine))
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

        }

        fetchData()
        setLoading(false)

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
                <input value={formData.prenom} onChange={e => handleChange('prenom', e.target.value)} placeholder="Prénom" className="border p-2 rounded" required />
                <input value={formData.nom} onChange={e => handleChange('nom', e.target.value)} placeholder="Nom" className="border p-2 rounded" required />
                <input type="number" value={formData.age} onChange={e => handleChange('age', Number(e.target.value))} placeholder="Âge" className="border p-2 rounded" required />
                <input value={formData.telephone_parent} onChange={e => handleChange('telephone_parent', e.target.value)} placeholder="Téléphone parent" className="border p-2 rounded" required />
            </div>

            <input value={formData.adresse} onChange={e => handleChange('adresse', e.target.value)} placeholder="Adresse" className="border p-2 w-full rounded" required />

            <div>
                <h3 className="font-semibold text-xl mb-4 border-b pb-2">Présences hebdomadaires</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {jours.map(jour => (
                        <div key={jour.id_jour} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                            <div className="text-lg capitalize font-medium text-gray-700 mb-3">{jour.jour_semaine}</div>
                            <div className="flex gap-4">
                                {['matin', 'apres_midi'].map(period => (
                                    <label key={period} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 cursor-pointer"
                                            checked={formData.presences?.[jour.id_jour]?.[period] || false}
                                            onChange={e => handlePresenceChange(jour.id_jour, period, e.target.checked)}
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
                <button
                    type="submit"
                    className=" bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow flex items-center gap-2"
                >
                    {initialData ? <><Pencil className="w-4 h-4"/> Modifier</> : <><CirclePlus className="w-4 h-4" /> Ajouter</>}
                </button>
            </div>
        </form>
    )
}
