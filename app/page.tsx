import ProductCatalog from '@/components/ProductCatalog'
import ShoppingCart from '@/components/ShoppingCart'
import UserToggle from '@/components/UserToggle'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <UserToggle />
      <div className="flex gap-8">
        <div className="flex-1">
          <ProductCatalog />
        </div>
        <div className="w-80">
          <ShoppingCart />
        </div>
      </div>
    </div>
  )
}

