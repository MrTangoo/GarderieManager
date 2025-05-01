import { getAllPresences, createPresence } from '@/lib/presence'
import { NextResponse } from 'next/server'

export async function GET() {
    const presences = await getAllPresences()
    return NextResponse.json(presences)
}

export async function POST(request) {
    const data = await request.json()
    const presence = await createPresence(data)
    return NextResponse.json(presence, { status: 201 })
}
