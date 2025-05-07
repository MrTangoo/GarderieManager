'use client'

import React, { useEffect, useState } from 'react'
import PrintLayout from './PrintLayout'
import { X, Check } from 'lucide-react'

const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']

const PresenceIcon = ({ present }) => (
    <div className="flex justify-center items-center h-full">
        {present ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-500" />}
    </div>
)

export default function TotalPrint({ onDone }) {
    const [rows, setRows] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const [enfantRes, presenceRes] = await Promise.all([
                fetch('/api/enfants'),
                fetch('/api/presence'),
            ])

            const enfants = await enfantRes.json()
            const presences = await presenceRes.json()

            const presenceMap = {}

            presences.forEach(({ enfant, jour, matin, apres_midi }) => {
                const id = enfant?.id_enfant
                const jourNom = jour?.jour_semaine
                if (!id || !jourNom) return

                presenceMap[id] ??= {}
                presenceMap[id][jourNom] ??= { matin: false, apres_midi: false }

                presenceMap[id][jourNom].matin ||= matin
                presenceMap[id][jourNom].apres_midi ||= apres_midi
            })

            const dataRows = enfants.map(({ id_enfant, nom, prenom }) => {
                const joursData = jours.map(jour => {
                    const p = presenceMap[id_enfant]?.[jour] || {}
                    return { matin: !!p.matin, apres_midi: !!p.apres_midi }
                })

                const total = joursData.reduce(
                    (acc, { matin, apres_midi }) => {
                        if (matin) acc.matin++
                        if (apres_midi) acc.apres_midi++
                        return acc
                    },
                    { matin: 0, apres_midi: 0 }
                )

                return { nom, prenom, jours: joursData, total }
            })

            dataRows.sort((a, b) =>
                a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }) ||
                a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' })
            )

            setRows(dataRows)
        }

        fetchData()
    }, [])

    if (!rows) return null

    return (
        <PrintLayout onDone={onDone}>
            <div className="p-6 print-page text-[13px] font-sans text-gray-800">
                <h1 className="text-2xl font-bold mb-6 text-center print:text-black">Feuille de présence - Totale</h1>

                <table className="w-full border-collapse border border-gray-400 text-center">
                    <thead className="bg-gray-100 text-sm">
                    <tr>
                        <th rowSpan="2" className="border p-2">Nom</th>
                        <th rowSpan="2" className="border p-2">Prénom</th>
                        {jours.map(jour => (
                            <th key={jour} colSpan="2" className="border p-2 capitalize">{jour}</th>
                        ))}
                        <th rowSpan="2" className="border p-2 bg-gray-100">Matin</th>
                        <th rowSpan="2" className="border p-2 bg-gray-100">AM</th>
                        <th rowSpan="2" className="border p-2 bg-gray-200">Total</th>
                    </tr>
                    <tr>
                        {jours.map(jour => (
                            <React.Fragment key={`${jour}-labels`}>
                                <th className="border p-1 text-xs">Matin</th>
                                <th className="border p-1 text-xs">AM</th>
                            </React.Fragment>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(({ nom, prenom, jours: joursData, total }, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border p-1 capitalize">{nom}</td>
                            <td className="border p-1 capitalize">{prenom}</td>
                            {joursData.map((j, i) => (
                                <React.Fragment key={i}>
                                    <td className="border p-1"><PresenceIcon present={j.matin} /></td>
                                    <td className="border p-1"><PresenceIcon present={j.apres_midi} /></td>
                                </React.Fragment>
                            ))}
                            <td className="border p-1 font-semibold bg-gray-100">{total.matin}</td>
                            <td className="border p-1 font-semibold bg-gray-100">{total.apres_midi}</td>
                            <td className="border p-1 font-bold bg-gray-200">{total.matin + total.apres_midi}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="mt-4 text-xs text-gray-600 print:text-black">
                    <div className="flex flex-wrap gap-4 items-center">
                        <p className="flex items-center gap-1"><Check className="text-green-500" size={14} /> = Présent</p>
                        <p className="flex items-center gap-1"><X className="text-red-500" size={14} /> = Absent</p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <p><strong>Matin</strong> = Matinée</p>
                        <p><strong>AM</strong> = Après-midi</p>
                    </div>
                </div>
            </div>
        </PrintLayout>
    )
}
