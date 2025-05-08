import { Trash, SquarePen, Archive } from 'lucide-react'
import EnfantTable from './EnfantTable'
import Link from 'next/link'
import Can from "@/components/Can"
import IconButton from "@/components/IconButton"
import { motion } from 'framer-motion'


export default function EnfantCard({ enfant, onDelete, onArchive }) {
    const { id_enfant, prenom, nom, age, adresse, telephone_parent, presences } = enfant
    const iconClasses = 'w-5 h-5 transition-colors'

    return (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">
                        {prenom} {nom}{' '}
                        <span className="text-base font-normal text-gray-500 normal-case">({age} ans)</span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Adresse : {adresse}</p>
                    <p className="text-sm text-gray-600">Téléphone parent : {telephone_parent}</p>
                </div>

                <div className="flex gap-1 md:gap-3 pt-1 items-center">
                    <Link
                        href={`/editEnfant/${id_enfant}`}
                        title="Éditer l'enfant"
                        aria-label="Modifier"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-orange-100 p-1 rounded-md"
                        >
                            <SquarePen className={`${iconClasses} text-yellow-500 hover:text-yellow-600`} />
                        </motion.div>
                    </Link>

                    <Can action="canArchive">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                                onClick={() => onArchive(id_enfant)}
                                title="Archiver l'enfant"
                                ariaLabel="Archiver"
                                bgColor="bg-gray-100"
                                icon={
                                    <Archive
                                        className={`${iconClasses} text-gray-500 hover:text-gray-700`}
                                    />
                                }
                            />
                        </motion.div>
                    </Can>

                    <Can action="canDelete">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                                onClick={() => onDelete(id_enfant)}
                                title="Supprimer l'enfant"
                                ariaLabel="Supprimer"
                                bgColor="bg-red-100"
                                icon={
                                    <Trash
                                        className={`${iconClasses} text-red-700 hover:text-red-900`}
                                    />
                                }
                            />
                        </motion.div>
                    </Can>
                </div>
            </div>

            <EnfantTable presences={presences} />
        </div>
    )
}
