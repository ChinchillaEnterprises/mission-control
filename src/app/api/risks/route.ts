import { NextResponse } from 'next/server'
import { getRisks } from '@/lib/beoniq-api'

export async function GET() {
  try {
    const risks = await getRisks()
    return NextResponse.json(risks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch risks' }, { status: 500 })
  }
}
