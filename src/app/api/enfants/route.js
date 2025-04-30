import { getAllEnfants, createEnfant } from '@/lib/enfant'
import { NextResponse } from 'next/server'

export async function GET() {
    const enfants = await getAllEnfants()
    return NextResponse.json(enfants)
}

export async function POST(req) {
    const body = await req.json()
    const enfant = await createEnfant(body)
    return NextResponse.json(enfant, { status: 201 })
}
