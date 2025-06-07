import { Test, TestingModule } from '@nestjs/testing'
import { WompiService } from '@infra/payment/wompi/wompi.service'
import axios from 'axios'
import { HttpException } from '@nestjs/common'
import * as crypto from 'crypto'

jest.mock('axios')

describe('WompiService', () => {
  let service: WompiService

  beforeEach(async () => {
    process.env.UAT_SANDBOX_URL = 'http://wompi'
    process.env.PRV_STAGTEST = 'private-key'
    process.env.PUB_STAGTEST = 'public-key'
    process.env.STAGTEST_INTEGRITY = 'integrity-key'

    const module: TestingModule = await Test.createTestingModule({
      providers: [WompiService]
    }).compile()

    service = module.get(WompiService)
    jest.spyOn(service as any, 'delay').mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('generarFirmaWompi should return sha256 hash', () => {
    const data = { reference: 'ref', amount_in_cents: 1000, currency: 'COP', integrity_key: 'key' }
    const expected = crypto.createHash('sha256').update('ref1000COPkey').digest('hex')
    expect(service.generarFirmaWompi(data)).toBe(expected)
  })

  describe('tokenizeCard', () => {
    const card = { number: '4111111111111111', cvc: '123', exp_month: '12', exp_year: '25', card_holder: 'Juan' }

    it('should return token on success', async () => {
      ;(axios.post as jest.Mock).mockResolvedValue({ data: { data: { id: 'token-1' } } })

      const token = await service.tokenizeCard(card)
      expect(token).toBe('token-1')
      expect(axios.post).toHaveBeenCalledWith(
        'http://wompi/tokens/cards',
        card,
        { headers: { Authorization: 'Bearer public-key' } }
      )
    })

    it('should throw HttpException on error', async () => {
      ;(axios.post as jest.Mock).mockRejectedValue(new Error('fail'))
      await expect(service.tokenizeCard(card)).rejects.toBeInstanceOf(HttpException)
    })
  })

  describe('getTokenAccess', () => {
    it('should return token on success', async () => {
      ;(axios.get as jest.Mock).mockResolvedValue({ data: { data: { presigned_acceptance: { acceptance_token: 'acc' } } } })

      const token = await service.getTokenAccess()
      expect(token).toBe('acc')
      expect(axios.get).toHaveBeenCalledWith('http://wompi/merchants/public-key')
    })
  })

  describe('payCard', () => {
    it('should return transaction result on success', async () => {
      ;(axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { presigned_acceptance: { acceptance_token: 'acc' } } } })
      ;(axios.post as jest.Mock).mockResolvedValueOnce({ data: { data: { id: 'trx-1' } } })
      ;(axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { id: 'trx-1', status: 'APPROVED', reference: 'ref-1' } } })

      const result = await service.payCard({
        amount: 1000,
        customerEmail: 'test@example.com',
        token: 'tok_stagtest_123',
        reference: 'ref-1',
        installments: 1
      })

      const signature = service.generarFirmaWompi({
        reference: 'ref-1',
        amount_in_cents: 1000 * 100,
        currency: 'COP',
        integrity_key: 'integrity-key'
      })

      expect(result).toEqual({ id: 'trx-1', status: 'APPROVED', reference: 'ref-1' })
      expect(axios.post).toHaveBeenCalledWith(
        'http://wompi/transactions',
        {
          amount_in_cents: 1000 * 100,
          currency: 'COP',
          customer_email: 'test@example.com',
          payment_method: { type: 'CARD', token: 'tok_stagtest_123', installments: 1 },
          reference: 'ref-1',
          signature,
          acceptance_token: 'acc'
        },
        { headers: { Authorization: 'Bearer private-key' } }
      )
    })
  })
})
