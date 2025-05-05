import { X, Check } from 'lucide-react'

const joursOrdre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']

export default function EnfantTable({ presences }) {
    const presencesTriees = [...presences].sort(
        (a, b) => joursOrdre.indexOf(a.jour) - joursOrdre.indexOf(b.jour)
    )

    return (
        <table className="w-full text-sm border">
            <thead className="bg-gray-100">
            <tr>
                <th className="border p-2">Jour</th>
                <th className="border p-2">Présence matin</th>
                <th className="border p-2">Présence après-midi</th>
            </tr>
            </thead>
            <tbody>
            {presencesTriees.map(({ jour, matin, apres_midi }, idx) => (
                <tr key={idx}>
                    <td className="border p-2 capitalize">{jour}</td>
                    <td className="border p-2">
                        {matin ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                    </td>
                    <td className="border p-2">
                        {apres_midi ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
