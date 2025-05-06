'use client'

import { useSession } from 'next-auth/react'
import { permissions } from '@/lib/permissions'

export default function Can({ action, children }) {
    const { data: session } = useSession()
    const role = session?.user?.role

    if (!role || !permissions[role]?.[action]) return null
    return <>{children}</>
}
