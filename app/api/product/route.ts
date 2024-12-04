import { NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8090'

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

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: response.status }
    )
  }

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url)
  const id = pathname.split('/').pop()
  const product = await request.json()
  
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })
  
  if (!response.ok) {
    console.error('Error updating product:', await response.text())
    return NextResponse.json({ error: 'Failed to update product' }, { status: response.status })
  }
  
  return NextResponse.json(await response.json(), { status: response.status })
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url)
  const id = pathname.split('/').pop()
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'DELETE',
  })
  return NextResponse.json({}, { status: response.status })
}