'use client'

import { useEffect, useState } from 'react'
import { CirclePlus, LoaderCircle, Pencil, Phone, House, Baby, Cake, CalendarDays } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { permissions } from '@/lib/permissions'
import TextInputWithIcon from '@/components/TextInputWithIcon'
import JourPresenceCard from '@/components/JourPresenceCard'


export default function EnfantForm({ initialData = null, onSubmit }) {
    const [formData, setFormData] = useState(null)
    const [jours, setJours] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data: session } = useSession()
    const role = session?.user?.role
    const canEdit = permissions[role]?.canEdit ?? false
    const canEditPresence = permissions[role]?.canEditPresence ?? false

    useEffect(() => {
        const fetchData = async () => {
            try {
                const joursRes = await fetch('/api/jourpresence')
                const joursData = await joursRes.json()

                const orderedDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
                joursData.sort(
                    (a, b) =>
                        orderedDays.indexOf(a.jour_semaine) - orderedDays.indexOf(b.jour_semaine)
                )
                setJours(joursData)

                const presences = Object.fromEntries(
                    joursData.map(j => [j.id_jour, { matin: false, apres_midi: false }])
                )

                if (initialData) {
                    const presRes = await fetch(`/api/presence/${initialData.id_enfant}`)
                    const enfantPresences = await presRes.json()

                    enfantPresences.forEach(p => {
                        presences[p.id_jour] = { matin: p.matin, apres_midi: p.apres_midi }
                    })
                }

                setFormData({
                    prenom: initialData?.prenom || '',
                    nom: initialData?.nom || '',
                    age: initialData?.age || '',
                    adresse: initialData?.adresse || '',
                    telephone_parent: initialData?.telephone_parent || '',
                    presences,
                })
            } catch (error) {
                console.error('Erreur lors du chargement des données', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
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

    const handleSubmit = async e => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit(formData)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading || !formData) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoaderCircle className="animate-spin text-gray-500 w-6 h-6" />
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white shadow-md border border-gray-200 p-6 rounded-xl"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInputWithIcon
                    value={formData.prenom}
                    onChange={e => handleChange('prenom', e.target.value)}
                    placeholder="Prénom"
                    icon={<Baby className="w-5 h-5" />}
                    disabled={!canEdit}
                />

                <TextInputWithIcon
                    value={formData.nom}
                    onChange={e => handleChange('nom', e.target.value)}
                    placeholder="Nom"
                    icon={<Baby className="w-5 h-5" />}
                    disabled={!canEdit}
                />

                <TextInputWithIcon
                    type="number"
                    value={formData.age}
                    onChange={e =>
                        handleChange('age', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="Age"
                    icon={<Cake className="w-5 h-5" />}
                    disabled={!canEdit}
                    min={1}
                />

                <TextInputWithIcon
                    type="tel"
                    value={formData.telephone_parent}
                    onChange={e => handleChange('telephone_parent', e.target.value)}
                    placeholder="Téléphone parent"
                    icon={<Phone className="w-4 h-4" />}
                    disabled={!canEdit}
                    pattern="^\+?[0-9]{10,15}$"
                    title="Veuillez entrer un numéro valide (10 à 15 chiffres, avec un '+' possible)"
                />
            </div>

            <TextInputWithIcon
                value={formData.adresse}
                onChange={e => handleChange('adresse', e.target.value)}
                placeholder="Adresse"
                icon={<House className="w-5 h-5" />}
                disabled={!canEdit}
            />

            <div>
                <div className="flex items-center gap-2 mb-4 border-b border-gray-300 pb-2">
                    <h3 className="font-semibold text-xl text-gray-800">Présences hebdomadaires</h3>
                    <CalendarDays className="w-6 h-6 text-gray-700" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {jours.map(jour => (
                        <JourPresenceCard
                            key={jour.id_jour}
                            jour={jour}
                            presences={formData.presences[jour.id_jour]}
                            onChange={(field, value) =>
                                handlePresenceChange(jour.id_jour, field, value)
                            }
                            disabled={!canEditPresence}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow flex items-center justify-center gap-2 transition-colors w-full sm:w-auto ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Envoi...
                        </>
                    ) : initialData ? (
                        <>
                            <Pencil className="w-4 h-4" />
                            Modifier
                        </>
                    ) : (
                        <>
                            <CirclePlus className="w-4 h-4" />
                            Ajouter
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
