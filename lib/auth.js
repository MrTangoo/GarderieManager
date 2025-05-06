import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                mot_de_passe: { label: 'Mot de passe', type: 'password' },
            },
            async authorize(credentials) {
                const user = await prisma.utilisateur.findUnique({
                    where: { login: credentials.login },
                })

                if (!user) throw new Error('Utilisateur introuvable')
                const isValid = await bcrypt.compare(credentials.mot_de_passe, user.mot_de_passe)
                if (!isValid) throw new Error('Mot de passe incorrect')

                return {
                    id: user.id_utilisateur,
                    login: user.login,
                    role: user.role,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.login = user.login
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                login: token.login,
                role: token.role,
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}
