import {
  CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ContextService } from '../context/context.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../auth/constants/user-role.constant';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userId = this.contextService.get('userId');
    const user = await this.usersService.findOneBy({ id: userId });

    if (!user) {
      throw new ForbiddenException();
    }

    if (!requiredRoles.includes(user.role)) {
      this.logger.warn(
        'User attempted to access route but does not have the required role',
        {
          userId,
          userRole: user.role,
          requiredRoles,
        },
      );
      throw new ForbiddenException();
    }

    return true;
  }
}
