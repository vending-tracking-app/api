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

import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Session } from '../entities/session';
import { User } from '../entities/user';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
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

    const request = context
      .switchToHttp()
      .getRequest<Request & { session: Session; user: User }>();

    const session = await this.authService.getSessionFromHeaders(
      request.headers,
    );

    if (!session || !session.user) {
      throw new UnauthorizedException();
    }

    request.session = session;
    request.user = session.user;

    return true;
  }
}
