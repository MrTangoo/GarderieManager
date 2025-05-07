
export default function HebdoTable ({ jour, groupe, pageIndex, totals }) {
    return (
        <div key={`${jour}-${pageIndex}`} className="p-6 print-page">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold capitalize">{jour}</h2>
                <h2 className="text-xl font-bold">Groupe : Grands</h2>
            </div>

            <table className="w-full text-sm border border-black">
                <thead className="bg-gray-200 border-b border-black text-left">
                <tr>
                    <th className="border p-1">Prénom</th>
                    <th className="border p-1">Activités matin</th>
                    <th className="border p-1">Repas</th>
                    <th className="border p-1">Sieste</th>
                    <th className="border p-1">Activités après-midi</th>
                    <th className="border p-1">Info à transmettre aux parents</th>
                </tr>
                </thead>
                <tbody>
                {groupe.map((e, i) => (
                    <tr key={`${e.prenom}-${i}`}>
                        <td className="border p-1">
                            <div className="capitalize">{e.prenom}</div>
                            <div>
                                Culotte <input type="checkbox" />
                            </div>
                        </td>
                        <td className="border p-1">{e.matin ? 'Présent' : 'Absent'}</td>
                        <td className="border p-1">
                            <ul className="list-none text-xs space-y-4">
                                <li>Ent</li>
                                <li>Pro</li>
                                <li>Féc</li>
                                <li>Lég</li>
                            </ul>
                        </td>
                        <td className="border p-1"></td>
                        <td className="border p-1">{e.apres_midi ? 'Présent' : 'Absent'}</td>
                        <td className="border p-1"></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="text-xl font-bold mt-4 flex justify-between items-center">
                <h2>Matin : {totals.matin}</h2>
                <h2>Repas : {totals.repas}</h2>
                <h2>Sieste : {totals.sieste}</h2>
                <h2>Après-midi : {totals.aprem}</h2>
            </div>
        </div>
    )
}
