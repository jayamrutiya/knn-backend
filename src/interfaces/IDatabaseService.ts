import { PrismaClient } from '@prisma/client';

export interface IDatabaseService {
    Client(): PrismaClient;

    disconnect(): Promise<void>;
}
