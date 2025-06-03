import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '@http/transaction/transaction.controller';
import { TransactionService } from '@app/transaction/services/transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            updateStatus: jest.fn(),
            findAll: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});