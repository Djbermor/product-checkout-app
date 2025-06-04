import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@store/hooks'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetTransaction, TransactionStatus } from '@store/slices/transactionSlice'
import { decrementStock } from '@store/slices/productSlice'
import Button from '@components/Button'
import { StepIndicator } from '@components/StepIndicator'
import { getTransactionStatus } from '@infra/api/wompiApi'

const StatusPage = () => {
  const { product } = useAppSelector((state) => state.transaction)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const transactionId = location.state?.transactionId

  const [status, setStatus] = useState<TransactionStatus>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getTransactionStatus(transactionId)
        const wompiStatus = result.status as TransactionStatus

        setStatus(wompiStatus)

        if (wompiStatus === 'APPROVED' && product) {
          dispatch(decrementStock(product.id))
        }
      } catch (err) {
        console.error(err)
        setError('No se pudo consultar el estado de la transacción.')
      } finally {
        setLoading(false)
      }
    }

    if (typeof transactionId === 'string' && transactionId.trim() !== '') {
      fetchStatus()
    } else {
      setError('ID de transacción no encontrado.')
      setLoading(false)
    }
  }, [transactionId, dispatch, product])

  const handleBackToHome = () => {
    dispatch(resetTransaction())
    localStorage.removeItem('checkout-form')
    localStorage.removeItem('product-quantities')
    navigate('/')
  }

  const renderStatusContent = () => {
    if (loading) {
      return <p className="text-gray-600">🔄 Consultando estado de la transacción...</p>
    }

    if (error) {
      return (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Error</h1>
          <p className="text-gray-700 mb-2">{error}</p>
        </>
      )
    }

    if (status === 'APPROVED') {
      return (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">¡Pago exitoso! 🎉</h1>
          <p className="text-gray-700 mb-2">Tu compra fue procesada correctamente.</p>
          <p className="text-sm text-gray-500 mb-4">ID de transacción: {transactionId}</p>
          <p className="text-sm text-gray-600">Gracias por confiar en nosotros. Tu pedido será entregado pronto.</p>
        </>
      )
    }

    return (
      <>
        <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Pago fallido</h1>
        <p className="text-gray-700 mb-2">Hubo un problema al procesar tu pago.</p>
        <p className="text-sm text-gray-500 mb-4">ID de transacción: {transactionId}</p>
        <p className="text-sm text-gray-600">Por favor, verifica tu información e inténtalo nuevamente.</p>
      </>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 text-center bg-white rounded-xl shadow">
      <StepIndicator />
      {renderStatusContent()}
      <Button className="mt-6 w-full" onClick={handleBackToHome}>
        Volver a la tienda
      </Button>
    </div>
  )
}

export default StatusPage