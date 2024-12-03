'use client'

import { useAppContext } from './providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface Product {
  id: number
  winkelwagenId: number
  name: string
  description: string
  price: number
  category: string
  label: string
  sustainable: boolean
}

interface Winkelwagen {
  id: number
  products: Product[]
  quantity: number
  totalPrice: number
}

export default function ShoppingCart() {
  const { cart, setCart } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)

  const handleAddToCart = async (productId: number, quantity: number = 1) => {
    if (!cart?.id) return
    
    try {
      const response = await fetch(`/api/winkelwagen/${cart.id}/producten?productId=${productId}&quantity=${quantity}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Error adding product to cart:', error)
    }
  }

  const handleRemoveFromCart = async (productId: number) => {
    if (!cart?.id) return

    try {
      const response = await fetch(`/api/winkelwagen/${cart.id}/producten/${productId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Error removing product from cart:', error)
    }
  }

  const fetchCart = async () => {
    if (!cart?.id) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`/api/winkelwagen/${cart.id}`)
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data: Winkelwagen = await response.json()
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [cart?.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full md:w-80">
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {!cart?.products || cart.products.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.products.map((product) => (
              <li key={product.id} className="flex justify-between items-center mb-2">
                <div>
                  <span>{product.name}</span>
                  <div className="text-sm text-gray-600">{product.description}</div>
                  <div>${product.price.toFixed(2)}</div>
                  {product.sustainable && (
                    <span className="text-green-600 text-xs">Sustainable</span>
                  )}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveFromCart(product.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="font-bold">Total:</span>
        <span>${cart?.totalPrice.toFixed(2) || '0.00'}</span>
      </CardFooter>
    </Card>
  )
}