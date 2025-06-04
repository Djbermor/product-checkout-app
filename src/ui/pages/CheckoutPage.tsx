import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '@components/Input'
import Button from '@components/Button'
import { StepIndicator } from '@components/StepIndicator'
import { Product } from '@domain/product/entities/Product'
import { createTransactionRequest } from '@infra/api/wompiApi'

const DELIVERY_FEE = 5000
const BASE_FEE_PERCENT = 0.05

const cardBrandImages: Record<string, string> = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
}

const detectCardBrand = (cardNumber: string) => {
  const clean = cardNumber.replace(/\s+/g, '')
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(clean)) return 'visa'
  if (/^5[1-5][0-9]{14}$/.test(clean)) return 'mastercard'
  return null
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const progress = JSON.parse(localStorage.getItem('progress') || '{}')
  const product: Product | undefined = progress.product
  const quantity: number = progress.quantity || 0

  // ✅ Validación para proteger acceso directo vía URL
  useEffect(() => {
    const isApproved = progress?.transaction?.status === 'APPROVED'
    const productSelected = progress?.product && progress?.quantity > 0
    if (!productSelected || isApproved) {
      navigate('/')
    }
  }, [])

  const [form, setForm] = useState(() => {
    return progress.form || {
      cardNumber: '',
      cardHolder: '',
      expMonth: '',
      expYear: '',
      cvc: '',
      address: '',
      phone: '',
      installments: '1',
    }
  })

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    const updatedForm = { ...form, [field]: value }
    setForm(updatedForm)

    localStorage.setItem(
      'progress',
      JSON.stringify({
        ...progress,
        form: updatedForm,
        currentStep: Math.max(progress.currentStep || 2, 2),
      })
    )
  }

  const generateEmail = (name: string) => {
    return `${name.toLowerCase().replace(/\s+/g, '')}@test.com`
  }

  const validate = () => {
    const newErrors: any = {}
    const cardBrand = detectCardBrand(form.cardNumber)

    if (!form.cardNumber || !cardBrand) newErrors.cardNumber = 'Tarjeta no válida (Visa o Mastercard)'
    if (!form.cardHolder.trim()) newErrors.cardHolder = 'Nombre requerido'
    if (!/^\d{3,4}$/.test(form.cvc)) newErrors.cvc = 'CVC inválido'
    if (!/^\d{1,2}$/.test(form.expMonth) || +form.expMonth < 1 || +form.expMonth > 12) newErrors.expMonth = 'Mes inválido'
    if (!/^\d{2,4}$/.test(form.expYear)) newErrors.expYear = 'Año inválido'
    if (!form.address.trim()) newErrors.address = 'Dirección requerida'
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Teléfono inválido (10 dígitos)'
    if (!['1', '2', '3'].includes(form.installments)) newErrors.installments = 'Cuotas inválidas'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || quantity <= 0) return setError('Producto inválido o sin cantidad seleccionada.')
    if (!validate()) return

    const subtotal = product.price * quantity
    const baseFee = Math.round(subtotal * BASE_FEE_PERCENT)
    const totalAmount = subtotal + baseFee + DELIVERY_FEE

    const dto = {
      productId: product.id,
      amount: totalAmount,
      customer: {
        name: form.cardHolder,
        phone: form.phone,
        email: generateEmail(form.cardHolder),
      },
      delivery: {
        address: form.address,
      },
      cardNumber: form.cardNumber,
      cardHolder: form.cardHolder,
      expirationDate: `${form.expMonth}/${form.expYear}`,
      cvv: form.cvc,
      installments: parseInt(form.installments),
    }

    try {
      setLoading(true)
      const response = await createTransactionRequest(dto)

      localStorage.setItem(
        'progress',
        JSON.stringify({
          ...progress,
          form,
          transaction: response.data,
          currentStep: 3,
        })
      )

      navigate('/summary', { state: { transaction: response.data } })
    } catch (err) {
      console.error('Error al crear la transacción', err)
      setError('Ocurrió un error al procesar el pago.')
    } finally {
      setLoading(false)
    }
  }

  const cardBrand = detectCardBrand(form.cardNumber)
  const cardImage = cardBrand ? cardBrandImages[cardBrand] : null

  return (
    <div className="max-w-md mx-auto p-4">
      <StepIndicator />
      {/* ... resto de tu formulario (sin cambios) */}
    </div>
  )
}

export default CheckoutPage