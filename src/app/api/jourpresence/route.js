import { getAllJoursPresence, createJourPresence } from '@/lib/jourpresence'
import { NextResponse } from 'next/server'

export async function GET() {
    const jours = await getAllJoursPresence()
    return NextResponse.json(jours)
}

export async function POST(request) {
    const data = await request.json()
    const jour = await createJourPresence(data)
    return NextResponse.json(jour, { status: 201 })
}
