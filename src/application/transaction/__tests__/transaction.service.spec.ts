import { Test, TestingModule } from '@nestjs/testing'
import { TransactionService } from '@app/transaction/services/transaction.service'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { WompiService } from '@infra/payment/wompi/wompi.service'
import { NotFoundException } from '@nestjs/common'
import { TransactionController } from '@http/transaction/transaction.controller'

describe('TransactionService', () => {
  let service: TransactionService
  let prisma: PrismaService
  let wompi: WompiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn(),
              update: jest.fn()
            },
            transaction: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn()
            },
            customer: {
              findFirst: jest.fn(),
              create: jest.fn(),
              connect: jest.fn()
            },
            delivery: {
              create: jest.fn()
            }
          }
        },
        {
          provide: WompiService,
          useValue: {
            payCard: jest.fn(),
            tokenizeCard: jest.fn().mockResolvedValue('mock-token')
          }
        }
      ]
    }).compile()

    service = module.get<TransactionService>(TransactionService)
    prisma = module.get<PrismaService>(PrismaService)
    wompi = module.get<WompiService>(WompiService)
  })

  describe('create', () => {
    it('debe crear una transacción con éxito y aprobarla', async () => {
      const dto = {
        productId: 'product-123',
        amount: 100000,
        installments: 1,
        customer: {
          name: 'Juan',
          phone: '3001234567',
          email: 'juan@example.com'
        },
        delivery: {
          address: 'Calle 123'
        },
        cardNumber: '4111111111111111',
        cardHolder: 'JUAN PÉREZ',
        expirationDate: '12/26',
        cvv: '123'
      }

      const fakeProduct = { id: dto.productId }
      const fakeTransaction = {
        id: 'tx-1',
        amount: dto.amount,
        customer: { email: dto.customer.email },
        productId: dto.productId
      }

      const wompiResponse = {
        id: 'wompi-123',
        status: 'APPROVED',
        reference: 'ref-123'
      }

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(fakeProduct as any)
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue(fakeTransaction as any)
      jest.spyOn(wompi, 'payCard').mockResolvedValue(wompiResponse)
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue({
        ...fakeTransaction,
        status: 'APPROVED',
        wompiId: 'wompi-123'
      } as any)
      jest.spyOn(prisma.product, 'update').mockResolvedValue({} as any)

      const result = await service.create(dto)
      expect(result.status).toBe('APPROVED')
      expect(result.wompiId).toBe('wompi-123')
    })

    it('debe lanzar error si el producto no existe', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null)

      await expect(
        service.create({
          productId: 'fake',
          amount: 100000,
          installments: 1,
          customer: {
            name: 'Ana',
            phone: '3012345678',
            email: 'ana@example.com'
          },
          delivery: { address: 'Cra 5' },
          cardNumber: '4111111111111111',
          cardHolder: 'ANA MARÍA',
          expirationDate: '10/27',
          cvv: '321'
        })
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateStatus', () => {
    it('debe actualizar status de transacción', async () => {
      const dto = {
        id: 'tx-2',
        status: 'APPROVED',
        wompiId: 'wompi-xyz'
      }

      const transaction = {
        id: 'tx-2',
        productId: 'prod-2',
        wompiId: null
      }

      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(transaction as any)
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue({ ...transaction, ...dto } as any)
      jest.spyOn(prisma.product, 'update').mockResolvedValue({} as any)

      const result = await service.updateStatus(dto)
      expect(result.status).toBe('APPROVED')
      expect(result.wompiId).toBe('wompi-xyz')
    })

    it('debe lanzar error si la transacción no existe (DECLINED)', async () => {
      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(null)

      await expect(
        service.updateStatus({
          id: 'fake-id',
          status: 'DECLINED'
        })
      ).rejects.toThrow(NotFoundException)
    })

    it('debe lanzar error si la transacción no existe (APPROVED)', async () => {
      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(null)

      await expect(
        service.updateStatus({
          id: 'fake-id',
          status: 'APPROVED'
        })
      ).rejects.toThrow(NotFoundException)
    })

    it('debe actualizar estado y descontar stock si es APPROVED', async () => {
      const mockTransaction = {
        id: 'trx123',
        status: 'PENDING',
        wompiId: null,
        productId: 'prod123'
      }

      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(mockTransaction as any)
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue({
        ...mockTransaction,
        status: 'APPROVED',
        wompiId: 'wompi987'
      } as any)
      jest.spyOn(prisma.product, 'update').mockResolvedValue({ id: 'prod123', stock: 4 } as any)

      const result = await service.updateStatus({
        id: 'trx123',
        status: 'APPROVED',
        wompiId: 'wompi987'
      })

      expect(result.status).toBe('APPROVED')
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod123' },
        data: { stock: { decrement: 1 } }
      })
    })

    it('debe actualizar estado sin descontar stock si es DECLINED', async () => {
      const mockTransaction = {
        id: 'trx456',
        status: 'PENDING',
        wompiId: null,
        productId: 'prod789'
      }

      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(mockTransaction as any)
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue({
        ...mockTransaction,
        status: 'DECLINED',
        wompiId: 'wompi666'
      } as any)

      const result = await service.updateStatus({
        id: 'trx456',
        status: 'DECLINED',
        wompiId: 'wompi666'
      })

      expect(result.status).toBe('DECLINED')
      expect(prisma.product.update).not.toHaveBeenCalled()
    })
  })
})