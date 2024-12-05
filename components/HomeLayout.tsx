'use client'

import ProductCatalog from '@/components/ProductCatalog'
import ShoppingCart from '@/components/ShoppingCart'
import UserToggle from '@/components/UserToggle'
import { useAppContext } from '@/components/providers'

export default function HomeLayout() {
  const { userRole } = useAppContext()

  return (
    <div className="container mx-auto p-4">
      <UserToggle />
      <div className="flex gap-8">
        <div className="flex-1">
          <ProductCatalog />
        </div>
        {userRole === 'customer' && (
          <div className="w-80">
            <ShoppingCart />
          </div>
        )}
      </div>
    </div>
  )
} 