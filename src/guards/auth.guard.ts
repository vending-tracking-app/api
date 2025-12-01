import {
  CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Request } from 'express';

import { ContextService } from '../context/context.service';
import { AuthService } from '../auth/auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const session = await this.authService.getSessionFromHeaders(
      request.headers,
    );

    if (!session) {
      throw new UnauthorizedException();
    }

    this.contextService.set('userId', session.user.id);

    return true;
  }
}
