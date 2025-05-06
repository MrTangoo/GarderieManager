import { X, Check } from 'lucide-react'

const joursOrdre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']

export default function EnfantTable({ presences }) {
    const presencesTriees = [...presences].sort(
        (a, b) => joursOrdre.indexOf(a.jour) - joursOrdre.indexOf(b.jour)
    )

    const renderIcon = (valeur) =>
        valeur ? (
            <Check className="text-green-500 inline-block" />
        ) : (
            <X className="text-red-500 inline-block" />
        )

    return (
        <table className="w-full text-md text-gray-700 rounded-lg border border-gray-200 overflow-hidden">
            <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="p-3 text-left border border-gray-200 font-large">
                    Jour
                </th>
                <th scope="col" className="p-3 text-center border border-gray-200 font-large">
                    Matin
                </th>
                <th scope="col" className="p-3 text-center border border-gray-200 font-large">
                    Après-midi
                </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {presencesTriees.map(({ jour, matin, apres_midi }, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-left capitalize border border-gray-200">{jour}</td>
                    <td className="p-3 text-center border border-gray-200">{renderIcon(matin)}</td>
                    <td className="p-3 text-center border border-gray-200">{renderIcon(apres_midi)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
