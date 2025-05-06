import { X, Check } from 'lucide-react'

const joursOrdre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']

export default function EnfantTable({ presences }) {
    const presencesTriees = [...presences].sort(
        (a, b) => joursOrdre.indexOf(a.jour) - joursOrdre.indexOf(b.jour)
    )

    return (
        <table className="w-full text-sm text-gray-700 rounded-lg border border-gray-200">
            <thead className="bg-gray-50 text-left ">
            <tr>
                <th className="p-3 font-large text-center border border-gray-200">Jour</th>
                <th className="p-3 font-large text-center border border-gray-200">Présence matin</th>
                <th className="p-3 font-large text-center border border-gray-200">Présence après-midi</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {presencesTriees.map(({ jour, matin, apres_midi }, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition border border-gray-200">
                    <td className="p-3 capitalize border border-gray-200">{jour}</td>
                    <td className="p-3 text-center border border-gray-200">
                        {matin ? (
                            <Check className="text-green-500 inline-block" />
                        ) : (
                            <X className="text-red-500 inline-block" />
                        )}
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                        {apres_midi ? (
                            <Check className="text-green-500 inline-block" />
                        ) : (
                            <X className="text-red-500 inline-block" />
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>

    )
}
