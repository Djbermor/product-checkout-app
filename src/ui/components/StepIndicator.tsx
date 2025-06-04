import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface StepIndicatorProps {
  hideStatusStep?: boolean
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ hideStatusStep = false }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const progress = JSON.parse(localStorage.getItem('progress') || '{}')
  const currentStep = progress.currentStep || 1
  const formData = progress.form || {}
  const status = progress.transaction?.status || null
  const purchaseInitiated = progress.purchaseInitiated === true

  const formCompleted =
    !!formData.cardNumber &&
    !!formData.cardHolder &&
    !!formData.expMonth &&
    !!formData.expYear &&
    !!formData.cvc &&
    !!formData.address &&
    !!formData.phone &&
    !!formData.installments

  const allSteps = [
    { path: '/', label: 'Productos' },
    { path: '/checkout', label: 'Pago y entrega' },
    { path: '/summary', label: 'Resumen' },
    { path: '/status', label: 'Estado' },
  ]

  const steps = hideStatusStep ? allSteps.slice(0, 3) : allSteps
  const currentPath = location.pathname
  const currentStepIndex = steps.findIndex((step) => currentPath === step.path)

  const isAvailable = (index: number): boolean => {
    const isFinal = ['APPROVED', 'DECLINED', 'ERROR'].includes(status)

    if (index === 0) {
      return currentPath === '/' && !isFinal
    }

    if (index === 1) {
      return purchaseInitiated && !isFinal
    }

    if (index === 2) {
      return currentPath === '/summary' && status !== 'PENDING' && status !== 'ERROR' && status !== 'DECLINED'
    }

    if (index === 3) {
      return currentPath === '/status'
    }

    return false
  }

  const handleClick = (index: number) => {
    if (!isAvailable(index)) return
    const targetPath = steps[index].path
    navigate(targetPath)
  }

  return (
    <div className="flex justify-center gap-4 mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex
        const available = isAvailable(index)

        return (
          <div
            key={step.path}
            onClick={() => available && handleClick(index)}
            className={`flex flex-col items-center text-sm font-medium transition duration-200 ${
              isActive
                ? 'text-blue-600'
                : available
                ? 'text-gray-600 hover:text-blue-500 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed pointer-events-none'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 border-2 text-xs font-bold ${
                isActive
                  ? 'border-blue-600 bg-blue-100'
                  : available
                  ? 'border-gray-400 bg-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {index + 1}
            </div>
            {step.label}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator