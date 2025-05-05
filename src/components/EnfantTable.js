export default function EnfantTable({ presences }) {
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
            {presences.map((p, idx) => (
                <tr key={idx}>
                    <td className="border p-2 capitalize">{p.jour}</td>
                    <td className="border p-2">{p.matin ? '✔️' : '❌'}</td>
                    <td className="border p-2">{p.apres_midi ? '✔️' : '❌'}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
