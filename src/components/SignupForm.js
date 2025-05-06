'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupForm() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, mot_de_passe: password }),
        })

        if (res.ok) {
            router.push('/login')
        } else {
            const data = await res.json()
            setError(data?.message || 'Une erreur est survenue.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5fbff] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">Créer un compte</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-colors shadow-sm"
                    >
                        S&apos;inscrire
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    )
}
