import { Role } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { BadRequest } from '../errors/BadRequest';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFound } from '../errors/NotFound';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { GetUserRole } from '../types/Role';

@injectable()
export class RoleRepository implements IRoleRepository {
  private _loggerService: ILoggerService;

  private _databaseService: IDatabaseService;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.DatabaseService) databaseService: IDatabaseService,
  ) {
    this._loggerService = loggerService;
    this._databaseService = databaseService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getRoleByName(roleName: string): Promise<Role> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const role = await client.role.findFirst({
        where: {
          name: roleName,
        },
      });

      if (role === null) {
        throw new NotFound(`Role not found with name ${roleName}`);
      }

      return role;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async assignRoleToUser(roleId: bigint, userId: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userRole = await client.userRole.create({
        data: {
          roleId,
          userId,
        },
      });

      return userRole !== null;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getUserRole(userId: bigint): Promise<GetUserRole> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userRole = await client.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          password: false,
          userName: false,
          salt: false,
          address: false,
          city: false,
          street: false,
          isSuspended: false,
          createdAt: false,
          updatedAt: false,
          UserRole: {
            select: {
              id: true,
              Role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!userRole) {
        throw new BadRequest('Invalid user id provided.');
      }

      const role = {
        id: userRole.UserRole[0].id,
        firstName: userRole.firstName,
        lastName: userRole.lastName,
        mobileNumber: userRole.mobileNumber,
        Role: userRole.UserRole[0].Role.name,
      };

      return role;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof BadRequest) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateUserRoler(roleId: bigint, id: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userRole = await client.userRole.update({
        where: {
          id,
        },
        data: {
          roleId,
        },
      });

      return userRole !== null;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }
}
