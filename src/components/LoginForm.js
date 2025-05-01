'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await signIn('credentials', {
            redirect: false,
            login,
            mot_de_passe: password,
            callbackUrl,
        })

        if (res?.ok && res?.url) {
            router.push(res.url)
        } else {
            setError('Identifiants invalides')
        }
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 border rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Login</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            className="w-full border p-2"
                        />
                    </div>
                    <div>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border p-2"
                        />
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">
                        Se connecter
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                        S&apos;inscrire
                    </Link>
                </p>
            </div>
        </div>
    )
}
