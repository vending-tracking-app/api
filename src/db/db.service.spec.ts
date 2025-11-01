import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;
  let runMigrationsMock: jest.Mock;

  beforeEach(async () => {
    runMigrationsMock = jest.fn().mockResolvedValue([]);
    const mockDataSource = {
      runMigrations: runMigrationsMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run migrations on module init', async () => {
    await service.onModuleInit();
    expect(runMigrationsMock).toHaveBeenCalledWith({
      transaction: 'all',
    });
  });
});
