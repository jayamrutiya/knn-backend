import { Role } from '@prisma/client';
import { GetUserRole } from '../types/Role';

export interface IRoleRepository {
  getRoleByName(roleName: string): Promise<Role>;

  assignRoleToUser(roleId: bigint, userId: bigint): Promise<boolean>;

  getUserRole(userId: bigint): Promise<GetUserRole>;

  getUserRole(userId: bigint): Promise<GetUserRole>;

  updateUserRoler(roleId: bigint, id: bigint): Promise<boolean>;
}
