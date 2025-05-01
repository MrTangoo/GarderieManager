import { Suspense } from 'react'
import SignupForm from '@/components/SignupForm'

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <SignupForm />
        </Suspense>
    )
}
