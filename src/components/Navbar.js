'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'lucide-react';
import { LogOut } from 'lucide-react';


export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center fixed z-10 w-full">
            <div className="text-lg font-semibold">
                <Link href="/">Garderie Manager</Link>
            </div>
            <div className="flex items-center gap-4">
                {session?.user ? (
                    <>
                        <div className="flex items-center">
                        <User />
                        <span className="text-sm">{session.user.login}</span>
                        </div>
                        <button onClick={() => signOut()} className="text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"  title="Se déconnecter" >
                            <LogOut className="h-5 w-5"/>
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Connexion</Link>
                        <Link href="/signup">Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    )
}
