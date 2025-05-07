'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export default function Navbar() {
    const { data: session, status } = useSession()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (status === 'loading') return null

    return (
        <nav
            className={`fixed top-0 w-full z-10 px-4 py-3 flex justify-between items-center backdrop-blur-lg transition-all duration-300 print:hidden ${
                scrolled ? 'border-b border-gray-200' : 'border-b border-transparent'
            }`}
        >
            <div className="text-2xl font-semibold text-black">
                <Link href="/">Garderie Manager</Link>
            </div>

            <div className="flex items-center gap-3">
                {session?.user ? (
                    <>
                        <div
                            className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
                            title={session.user.login}
                        >
                            <svg
                                className="absolute w-12 h-12 text-gray-400 -left-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="text-sm hover:text-red-600 text-red-400 bg-red-100 font-bold py-1 px-2 rounded"
                            title="Se déconnecter"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            Inscription
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
