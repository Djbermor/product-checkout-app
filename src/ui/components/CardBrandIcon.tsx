import React from 'react'
import visaLogo from '@/assets/visa.svg'
import mastercardLogo from '@/assets/mastercard.svg'

interface Props {
  cardNumber: string
}

export const CardBrandIcon: React.FC<Props> = ({ cardNumber }) => {
  const getCardBrand = (number: string): 'visa' | 'mastercard' | null => {
    if (/^4[0-9]{0,}/.test(number)) return 'visa'
    if (/^5[1-5][0-9]{0,}/.test(number)) return 'mastercard'
    return null
  }

  const brand = getCardBrand(cardNumber)

  if (!brand) return null

  return (
    <img
      src={brand === 'visa' ? visaLogo : mastercardLogo}
      alt={brand}
      className="h-6 w-auto ml-2"
    />
  )
}