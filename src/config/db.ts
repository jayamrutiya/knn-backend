import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { IDatabaseService } from '../interfaces/IDatabaseService';

@injectable()
// Implements singleton pattern
export class DatabaseService implements IDatabaseService {
  private _db: PrismaClient = new PrismaClient();

  public constructor() {
    this._db = new PrismaClient();
  }

  public Client(): PrismaClient {
    return this._db;
  }

  public async disconnect(): Promise<void> {
    await this._db.$disconnect();
  }
}
