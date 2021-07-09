import { GetUserRole } from '../types/Role';

export interface IRoleService {
  getUserRole(userId: bigint): Promise<GetUserRole>;
}
