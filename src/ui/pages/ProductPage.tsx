import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@components/Button'
import { StepIndicator } from '@components/StepIndicator'
import { fetchProducts } from '@app/fetchProducts'
import { Product } from '@domain/product/entities/Product'
import Input from '@components/Input'

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data)
        const progress = localStorage.getItem('progress')
        if (progress) {
          const parsed = JSON.parse(progress)
          if (parsed.product && parsed.quantity) {
            setQuantities({ [parsed.product.id]: parsed.quantity })
          }
        }
      })
      .catch(console.error)
  }, [])

  const handleQuantityChange = (productId: string, value: number) => {
    const cleanValue = Math.max(0, value)

    // Limpiar progreso si cambia cantidad o producto
    const stored = localStorage.getItem('progress')
    if (stored) {
      const parsed = JSON.parse(stored)
      const originalKey = parsed.selectedKey
      const newKey = `${productId}-${cleanValue}`

      if (originalKey !== newKey) {
        delete parsed.selectedKey
        localStorage.setItem('progress', JSON.stringify(parsed))
      }

      // Si se elimina la selección (0), limpia todo
      if (cleanValue === 0) {
        localStorage.removeItem('progress')
      }
    }

    setQuantities({ [productId]: cleanValue })
  }

  const handleBuy = (product: Product) => {
    const quantity = quantities[product.id] || 0
    if (quantity <= 0) return

    const selectedKey = `${product.id}-${quantity}`

    const progress = {
      currentStep: 2,
      product,
      quantity,
      selectedKey,
    }

    localStorage.setItem('progress', JSON.stringify(progress))
    navigate('/checkout', { state: { product, quantity } })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <StepIndicator />
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Explora nuestros productos</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const quantity = quantities[product.id] || 0
          const isSelected = quantity > 0
          const availableStock = product.stock - quantity

          return (
            <div
              key={product.id}
              className={`rounded-2xl shadow-lg p-6 transition-transform duration-200 transform bg-white border-2 hover:scale-105 ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              <p className="text-md font-bold text-gray-900 mb-1">${(product.price / 100).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mb-3">Stock disponible: {availableStock}</p>
              <Input
                type="number"
                min={0}
                max={product.stock}
                value={quantity.toString()}
                onChange={(val) =>
                  handleQuantityChange(product.id, Math.min(product.stock, Number(val)))
                }
                label="Cantidad"
                className="mb-3"
              />
              <Button
                onClick={() => handleBuy(product)}
                className={`w-full transition-colors duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {isSelected ? 'Comprar este producto' : 'Selecciona una cantidad'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}