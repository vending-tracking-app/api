import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth as betterAuthFactory } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { type Request } from 'express';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';

import { SessionsRepository } from './sessions.repository';
import { typeormAdapter } from './typeorm-adapter';

@Injectable()
export class AuthService {
  readonly betterAuth: ReturnType<typeof betterAuthFactory>;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly sessionsRepository: SessionsRepository,
  ) {
    this.betterAuth = betterAuthFactory({
      trustedOrigins: [this.configService.getOrThrow('FRONTEND_URL')],
      basePath: '/auth',
      database: typeormAdapter(this.dataSource),
      emailAndPassword: { enabled: true },
      advanced: {
        database: {
          generateId: () => randomUUID(),
        },
      },
    });
  }

  async getSessionFromHeaders(headers: Request['headers']) {
    const session = await this.betterAuth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (!session?.session) {
      return null;
    }

    return this.sessionsRepository.findOne({
      where: {
        id: session.session.id,
      },
      relations: {
        user: true,
      },
    });
  }
}
