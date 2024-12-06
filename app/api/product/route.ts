import { NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8083/product'

export async function GET() {
  const response = await fetch(`${API_BASE_URL}/api/product`)
  const data = await response.json()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const product = await request.json()
  const response = await fetch(`${API_BASE_URL}/api/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })
  return NextResponse.json(await response.json(), { status: response.status })
}