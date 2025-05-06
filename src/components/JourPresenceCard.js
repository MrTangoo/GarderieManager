export default function JourPresenceCard({jour, presences, onChange, disabled = false}) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors">
            <div className="text-lg capitalize font-semibold text-gray-700 mb-3">
                {jour.jour_semaine}
            </div>
            <div className="flex gap-6">
                {['matin', 'apres_midi'].map(period => (
                    <label
                        key={period}
                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                    >
                        <input
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
                            checked={presences?.[period] || false}
                            onChange={e => onChange(period, e.target.checked)}
                            disabled={disabled}
                        />
                        <span>{period === 'matin' ? 'Matin' : 'Après-midi'}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}
