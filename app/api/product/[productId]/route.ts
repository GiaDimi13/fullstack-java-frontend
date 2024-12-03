import { NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:8090'

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId
  const productRequest = await request.json()

  const response = await fetch(`${API_BASE_URL}/api/product/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productRequest),
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: response.status }
    )
  }

  return NextResponse.json(await response.json())
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    console.log('Attempting to delete product with ID:', params.productId)
    
    const response = await fetch(`${API_BASE_URL}/api/product/${params.productId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error:', errorText)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: response.status }
      )
    }

    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error in DELETE handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 