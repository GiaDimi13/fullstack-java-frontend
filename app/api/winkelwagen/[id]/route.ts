import { NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8083/winkelwagen'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/winkelwagen/${params.id}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching winkelwagen' }, { status: 500 })
  }
} 