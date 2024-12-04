import { NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8091'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  const quantity = searchParams.get('quantity')

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/winkelwagen/${params.id}/producten?productId=${productId}&quantity=${quantity}`,
      { method: 'POST' }
    )
    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error adding product' }, { status: 500 })
  }
} 