import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <LoginForm />
        </Suspense>
    )
}
