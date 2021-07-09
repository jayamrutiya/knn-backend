import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { IRoleService } from '../interfaces/IRoleService';
import { GetUserRole } from '../types/Role';

@injectable()
export class RoleService implements IRoleService {
  private _loggerService: ILoggerService;

  private _roleRepository: IRoleRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
  ) {
    this._loggerService = loggerService;
    this._roleRepository = roleRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getUserRole(userId: bigint): Promise<GetUserRole> {
    return this._roleRepository.getUserRole(userId);
  }
}
