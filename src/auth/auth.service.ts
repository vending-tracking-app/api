import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth as betterAuthFactory } from 'better-auth';
import { DataSource } from 'typeorm';

import { typeormAdapter } from './typeorm-adapter';

@Injectable()
export class AuthService {
  readonly betterAuth: ReturnType<typeof betterAuthFactory>;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.betterAuth = betterAuthFactory({
      trustedOrigins: [this.configService.getOrThrow('FRONTEND_URL')],
      basePath: '/auth',
      database: typeormAdapter(this.dataSource),
      emailAndPassword: { enabled: true },
      advanced: {
        database: {
          generateId: 'uuid',
        },
      },
    });
  }
}
