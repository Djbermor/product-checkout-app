import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductPage from '@pages/ProductPage'
import { getProducts } from '@infra/api/wompiApi'
import React from 'react'

jest.mock('@infra/api/wompiApi', () => ({
  getProducts: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Camisa Blanca',
      description: 'Camisa de algodón talla M',
      price: 95000,
      stock: 10,
    },
  ]),
}))

describe('ProductPage', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    )
  })

  it('renderiza el título de la página', () => {
    const heading = screen.getByRole('heading', {
      name: /explora nuestros productos/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('renderiza al menos un producto tras cargar', async () => {
    const producto = await waitFor(() => screen.getByText(/camisa blanca/i))
    expect(producto).toBeInTheDocument()
  })

  it('muestra botón comprar si hay stock', async () => {
    const boton = await waitFor(() =>
      screen.getByRole('button', { name: /comprar/i })
    )
    expect(boton).toBeInTheDocument()
  })
})