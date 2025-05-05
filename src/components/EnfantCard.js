import { Trash2 } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import { Archive } from 'lucide-react';
import EnfantTable from './EnfantTable';

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
                <div className="gap-2 flex">
                <button
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Editer l'enfant"
                >
                    <SquarePen className="w-5 h-5" />
                </button>
                    <button
                        onClick={() => onArchive(enfant.id_enfant)}
                        className="text-gray-500 hover:text-gray-800"
                        title="Archiver l'enfant"
                    >
                        <Archive className="w-5 h-5" />
                    </button>

                    <button
                    onClick={() => onDelete(enfant.id_enfant)}
                    className="text-red-500 hover:text-red-800"
                    title="Supprimer l'enfant"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                </div>
            </div>

            <EnfantTable presences={enfant.presences} />
        </div>
    );
}
