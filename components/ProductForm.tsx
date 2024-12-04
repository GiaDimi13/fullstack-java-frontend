'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, ProductRequest, Category } from '@/types/product'

interface ProductFormProps {
  onSubmit: (productRequest: ProductRequest) => void
  initialData?: Product
  title: string
  onCancel: () => void
}

export default function ProductForm({ onSubmit, initialData, title, onCancel }: ProductFormProps) {
  console.log('ProductForm initialData:', initialData)

  const [formData, setFormData] = useState<ProductRequest>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || Category.FOOD,
    label: initialData?.label || '',
    sustainable: initialData?.sustainable || false,
  })

  useEffect(() => {
    if (initialData) {
      console.log('Setting form data from initialData:', initialData)
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        label: initialData.label,
        sustainable: initialData.sustainable,
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    console.log('Initial data when submitting:', initialData)
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title} {initialData?.id ? `(ID: ${initialData.id})` : ''}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full p-2 border rounded"
              required
            >
              {Object.values(Category).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.sustainable}
              onChange={(e) => setFormData({ ...formData, sustainable: e.target.checked })}
              id="sustainable"
            />
            <label htmlFor="sustainable" className="text-sm font-medium">
              Sustainable
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save {initialData?.id ? 'Changes' : 'New Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 