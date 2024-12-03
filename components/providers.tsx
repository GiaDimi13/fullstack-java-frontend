'use client'

import { createContext, useState, useContext } from 'react'

type UserRole = 'customer' | 'admin'

interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  label: string
  sustainable: boolean
}

interface Cart {
  id: number
  products: Product[]
  totalPrice: number
  quantity: number
}

interface AppContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  cart: Cart | null
  setCart: (cart: Cart) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
}

export const AppContext = createContext<AppContextType>({
  userRole: 'customer',
  setUserRole: () => {},
  cart: null,
  setCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('customer')
  const [cart, setCart] = useState<Cart | null>(null)

  const addToCart = async (product: Product) => {
    // This will be handled by the ShoppingCart component
  }

  const removeFromCart = async (productId: number) => {
    // This will be handled by the ShoppingCart component
  }

  return (
    <AppContext.Provider value={{ userRole, setUserRole, cart, setCart, addToCart, removeFromCart }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a Providers component')
  }
  return context
}

