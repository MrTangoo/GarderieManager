import { Trash2, SquarePen, Archive } from 'lucide-react'
import EnfantTable from './EnfantTable'
import Link from 'next/link'

export default function EnfantCard({ enfant, onDelete, onArchive }) {
    return (
        <div className="mb-6 border p-4 rounded shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        {enfant.prenom} {enfant.nom} ({enfant.age} ans)
                    </h2>
                    <p className="text-sm text-gray-600">Adresse : {enfant.adresse}</p>
                    <p className="text-sm text-gray-600">Téléphone parent : {enfant.telephone_parent}</p>
                </div>
                <div className="flex gap-2 pt-1">
                    <Link href={`/editEnfant/${enfant.id_enfant}`} title="Éditer l'enfant">
                        <SquarePen className="w-5 h-5 text-yellow-500 hover:text-yellow-600 cursor-pointer" />
                    </Link>
                    <Archive
                        onClick={() => onArchive(enfant.id_enfant)}
                        className="w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer"
                        title="Archiver l'enfant"
                    />
                    <Trash2
                        onClick={() => onDelete(enfant.id_enfant)}
                        className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer"
                        title="Supprimer l'enfant"
                    />
                </div>
            </div>

            <EnfantTable presences={enfant.presences} />
        </div>
    )
}
