import { NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8083/winkelwagen'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; productId: string } }
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/winkelwagen/${params.id}/producten/${params.productId}`,
      { method: 'DELETE' }
    )
    return NextResponse.json({}, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Error removing product' }, { status: 500 })
  }
} 