import { Injectable } from '@nestjs/common';
import { betterAuth as betterAuthFactory } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { IncomingHttpHeaders } from 'http';
import { DataSource } from 'typeorm';

import { typeormAdapter } from './typeorm-adapter';

@Injectable()
export class AuthService {
  readonly betterAuth: ReturnType<typeof betterAuthFactory>;

  constructor(private readonly dataSource: DataSource) {
    this.betterAuth = betterAuthFactory({
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

  async getSessionFromHeaders(headers: IncomingHttpHeaders) {
    return this.betterAuth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }
}
