import ProductCatalog from '../components/ProductCatalog'
import ShoppingCart from '../components/ShoppingCart'
import UserToggle from '../components/UserToggle'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <UserToggle />
      <div className="flex flex-col md:flex-row gap-4">
        <ProductCatalog />
        <ShoppingCart />
      </div>
    </main>
  )
}

