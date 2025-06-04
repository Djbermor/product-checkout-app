import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { Transaction } from '@shared/types'
import Button from '@ui/components/Button'
import { StepIndicator } from '@components/StepIndicator'

export default function SummaryPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const transaction: Transaction = state?.transaction

  useEffect(() => {
    const current = localStorage.getItem('progress')
    const parsed = current ? JSON.parse(current) : {}
    const form = parsed?.form

    const validForm =
      form?.cardNumber &&
      form?.cardHolder &&
      form?.expMonth &&
      form?.expYear &&
      form?.cvc &&
      form?.address &&
      form?.phone &&
      form?.installments

    if (!transaction || !validForm) {
      navigate('/')
    } else {
      localStorage.setItem(
        'progress',
        JSON.stringify({
          ...parsed,
          transaction,
          currentStep: 3,
        })
      )
    }
  }, [transaction, navigate])

  if (!transaction) return null

  const { product, customer, delivery, status, id } = transaction

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <StepIndicator hideStatusStep={status === 'APPROVED'} />
      <div className="border rounded-xl shadow space-y-4 p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700">Resumen de la compra</h1>

        <div>
          <h2 className="font-semibold">🛒 Producto</h2>
          <p>{product.name} - ${(product.price / 100).toFixed(2)}</p>
          <p>{product.description}</p>
        </div>

        <div>
          <h2 className="font-semibold">👤 Cliente</h2>
          <p>{customer.name}</p>
          <p>{customer.email}</p>
          <p>{customer.phone}</p>
        </div>

        <div>
          <h2 className="font-semibold">🏠 Entrega</h2>
          <p>{delivery.address}</p>
        </div>

        <div>
          <h2 className="font-semibold">💳 Estado del pago</h2>
          <p
            className={`font-bold ${
              status === 'APPROVED'
                ? 'text-green-600'
                : status === 'DECLINED'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {status}
          </p>
        </div>

        <div className="text-center mt-4">
          {status === 'PENDING' ? (
            <Button onClick={() => navigate('/status', { state: { transactionId: id } })}>
              Consultar estado
            </Button>
          ) : (
            <Button onClick={() => navigate('/')}>Volver al inicio</Button>
          )}
        </div>
      </div>
    </div>
  )
}