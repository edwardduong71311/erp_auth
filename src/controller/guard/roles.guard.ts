import {
    Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata,
    Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../dto/role.enum';
import { IUserService } from 'src/domain/service/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(IUserService) private readonly userService: IUserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.email) return false;

        const roles = await this.userService.getUserRoleByEmail(user.email);
        if (roles.includes(Role.Admin)) return true;

        return requiredRoles.some((role) => roles.includes(role));
    }
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
