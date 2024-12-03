'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from './providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, ProductRequest, Category } from '@/types/product'
import ProductForm from './ProductForm'

export default function ProductCatalog() {
  const { userRole, addToCart } = useAppContext()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleAddProduct = async (productRequest: ProductRequest) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productRequest),
      })
      if (response.ok) {
        await fetchProducts()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleEditProduct = async (productRequest: ProductRequest) => {
    const productId = editingProduct?.id
    if (!productId) {
      console.error('No product ID found for editing')
      return
    }

    try {
      console.log('Editing product with ID:', productId)
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productRequest),
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to update product:', errorText)
        return
      }

      await fetchProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error updating product:', error)
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

  if (showForm) {
    return (
      <ProductForm
        onSubmit={(productRequest) => {
          console.log('Form submitted with data:', productRequest)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{product.description}</p>
                <p className="font-bold mt-2">Price: ${product.price.toFixed(2)}</p>
                <p>Category: {product.category}</p>
                <p>Label: {product.label}</p>
                {product.sustainable && <p className="text-green-600">Sustainable</p>}
              </CardContent>
              <CardFooter>
                {userRole === 'customer' ? (
                  <Button onClick={() => addToCart(product)}>Add to Cart</Button>
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
          <p>No products available</p>
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
