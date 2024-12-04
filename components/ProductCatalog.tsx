'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from './providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product, ProductRequest, Category } from '@/types/product'
import ProductForm from './ProductForm'

export default function ProductCatalog() {
  const { userRole } = useAppContext()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sustainableFilter, setSustainableFilter] = useState<boolean | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, priceFilter, categoryFilter, sustainableFilter, products])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Price filter
    switch (priceFilter) {
      case 'under50':
        filtered = filtered.filter(product => product.price < 50)
        break
      case '50to100':
        filtered = filtered.filter(product => product.price >= 50 && product.price <= 100)
        break
      case 'over100':
        filtered = filtered.filter(product => product.price > 100)
        break
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    // Sustainable filter
    if (sustainableFilter !== null) {
      filtered = filtered.filter(product => product.sustainable === sustainableFilter)
    }

    setFilteredProducts(filtered)
  }

  const handleAddProduct = async (productRequest: ProductRequest) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productRequest.name,
          description: productRequest.description,
          price: productRequest.price,
          category: productRequest.category,
          label: productRequest.label,
          sustainable: productRequest.sustainable
        })
      })
      if (response.ok) {
        fetchProducts()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleEditProduct = async (productRequest: ProductRequest) => {
    if (!editingProduct?.id) return
    
    try {
      const response = await fetch(`/api/product/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productRequest),
      })
      if (response.ok) {
        fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
      }
    } catch (error) {
      console.error('Error editing product:', error)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch(`/api/winkelwagen/1/producten?productId=${productId}&quantity=1`, {
        method: 'POST',
      })
      if (response.ok) {
        const event = new CustomEvent('cartUpdated')
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const getCategoryDisplayName = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' ')
  }

  if (showForm) {
    return (
      <ProductForm
        onSubmit={(productRequest) => {
          if (editingProduct) {
            handleEditProduct(productRequest)
          } else {
            handleAddProduct(productRequest)
          }
        }}
        initialData={editingProduct || undefined}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        onCancel={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
      />
    )
  }

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold mb-4">Product Catalog</h2>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <div className="flex gap-4 flex-wrap">
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under50">Under €50</SelectItem>
              <SelectItem value="50to100">€50 - €100</SelectItem>
              <SelectItem value="over100">Over €100</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(Category).map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryDisplayName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={sustainableFilter === null ? 'all' : sustainableFilter.toString()} 
            onValueChange={(value) => setSustainableFilter(value === 'all' ? null : value === 'true')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sustainability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="true">Sustainable Only</SelectItem>
              <SelectItem value="false">Non-Sustainable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{product.description}</p>
                <p className="font-bold mt-2">Price: €{product.price.toFixed(2)}</p>
                <p>Category: {product.category}</p>
                <p>Label: {product.label}</p>
                {product.sustainable && <p className="text-green-600">Sustainable</p>}
              </CardContent>
              <CardFooter>
                {userRole === 'customer' ? (
                  <Button onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No products found matching your criteria</p>
        )}
      </div>
      
      {userRole === 'admin' && (
        <Button
          className="mt-4"
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
        >
          Add New Product
        </Button>
      )}
    </div>
  )
}
