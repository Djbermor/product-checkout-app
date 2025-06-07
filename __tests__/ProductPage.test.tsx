import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductPage from '@pages/ProductPage'
import React from 'react'

// Mocks si es necesario, por ejemplo fetchProducts o llamadas API
jest.mock('@app/fetchProducts', () => ({
  fetchProducts: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Producto Test',
      description: 'Descripción del producto',
      price: 100000,
      stock: 10
    }
  ])
}))

describe('ProductPage', () => {
  it('renders product page title', async () => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    )

    expect(await screen.findByRole('heading', { name: /explora nuestros productos/i }))
      .toBeInTheDocument()
    expect(await screen.findByText('Producto Test')).toBeInTheDocument()
  })
})