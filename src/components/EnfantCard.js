import { Trash2, SquarePen, Archive } from 'lucide-react'
import EnfantTable from './EnfantTable'
import Link from 'next/link'
import Can from "@/components/Can"

export default function EnfantCard({ enfant, onDelete, onArchive }) {
    const { id_enfant, prenom, nom, age, adresse, telephone_parent, presences } = enfant

    const iconClasses = 'w-5 h-5 cursor-pointer transition-colors'

    return (
        <div className="mb-6 border p-4 rounded shadow bg-white">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        {prenom} {nom} ({age} ans)
                    </h2>
                    <p className="text-sm text-gray-600">Adresse : {adresse}</p>
                    <p className="text-sm text-gray-600">Téléphone parent : {telephone_parent}</p>
                </div>

                <div className="flex gap-2 pt-1">
                    <Link href={`/editEnfant/${id_enfant}`} title="Éditer l'enfant" aria-label="Modifier">
                        <SquarePen className={`${iconClasses} text-yellow-500 hover:text-yellow-600`} />
                    </Link>

                    <Can action="canArchive">
                        <Archive
                            onClick={() => onArchive(id_enfant)}
                            className={`${iconClasses} text-gray-500 hover:text-gray-800`}
                            title="Archiver l'enfant"
                            aria-label="Archiver"
                        />
                    </Can>

                    <Can action="canDelete">
                        <Trash2
                            onClick={() => onDelete(id_enfant)}
                            className={`${iconClasses} text-red-500 hover:text-red-800`}
                            title="Supprimer l'enfant"
                            aria-label="Supprimer"
                        />
                    </Can>
                </div>
            </div>

            <EnfantTable presences={presences} />
        </div>
    )
}
