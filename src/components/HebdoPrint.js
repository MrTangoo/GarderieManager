import React, { useEffect, useState } from 'react'
import PrintLayout from './PrintLayout'
import HebdoTable from './HebdoTable'

export default function HebdoPrint({ onDone }) {
    const [data, setData] = useState(null)
    const joursOrdres = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/presence')
            const raw = await res.json()

            const grouped = joursOrdres.reduce((acc, jour) => {
                acc[jour] = []
                return acc
            }, {})

            raw.forEach(p => {
                const jour = p?.jour?.jour_semaine
                if ((p.matin || p.apres_midi) && grouped[jour]) {
                    grouped[jour].push({
                        prenom: p.enfant?.prenom || '',
                        matin: !!p.matin,
                        apres_midi: !!p.apres_midi,
                    })
                }
            })

            setData(grouped)
        }

        fetchData()
    }, [])

    if (!data) return null

    return (
        <PrintLayout onDone={onDone}>
            {joursOrdres.map(jour => {
                const enfants = (data[jour] || []).slice().sort((a, b) =>
                    a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' })
                )

                const groupes = []
                for (let i = 0; i < enfants.length; i += 5) {
                    groupes.push(enfants.slice(i, i + 5))
                }

                const totals = {
                    matin: enfants.filter(e => e.matin).length,
                    aprem: enfants.filter(e => e.apres_midi).length,
                    repas: enfants.filter(e => e.matin).length,
                    sieste: enfants.filter(e => e.apres_midi).length,
                }

                return groupes.map((groupe, index) => (
                    <HebdoTable
                        key={`${jour}-${index}`}
                        jour={jour}
                        groupe={groupe}
                        pageIndex={index}
                        totals={totals}
                    />
                ))
            })}
        </PrintLayout>
    )
}
