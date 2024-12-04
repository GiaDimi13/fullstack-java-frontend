'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

interface WinkelwagenItemResponse {
  productId: number
  productName: string
  productPrice: number
  quantity: number
  subtotal: number
}

interface WinkelwagenResponse {
  id: number
  items: WinkelwagenItemResponse[]
  totalPrice: number
}

export default function ShoppingCart() {
  const [cart, setCart] = useState<WinkelwagenResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/winkelwagen/1', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      const response = await fetch(`/api/winkelwagen/1/producten/${productId}`, {
        method: 'DELETE',
      })
      
      fetchCart()
      
      if (!response.ok) {
        console.warn('Delete request returned error status, but item was removed:', response.status)
      }
    } catch (error) {
      console.error('Error removing item:', error)
      fetchCart()
    }
  }

  useEffect(() => {
    fetchCart()
    // Refresh cart every 5 seconds
    const interval = setInterval(fetchCart, 5000)
    
    // Add event listener for cart updates
    const handleCartUpdate = () => fetchCart()
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  if (isLoading) {
    return <div className="animate-pulse">Loading cart...</div>
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="bg-gray-50">
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!cart?.items || cart.items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          <ul className="divide-y">
            {cart.items.map((item) => (
              <li key={item.productId} className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Quantity: {item.quantity} × €{item.productPrice.toFixed(2)}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      Subtotal: €{(item.quantity * item.productPrice).toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {cart && cart.items && cart.items.length > 0 && (
        <CardFooter className="bg-gray-50 px-4 py-3">
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold">
              €{cart.totalPrice.toFixed(2)}
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}