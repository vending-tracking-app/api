import { Injectable } from '@nestjs/common';
import {
  Auth as BetterAuth,
  betterAuth as betterAuthFactory,
  BetterAuthOptions,
} from 'better-auth';
import { admin as adminPlugin } from 'better-auth/plugins';
import { fromNodeHeaders } from 'better-auth/node';
import { IncomingHttpHeaders } from 'http';
import { DataSource } from 'typeorm';

import { typeormAdapter } from './typeorm-adapter';

const authOptions = {
  basePath: '/auth',
  emailAndPassword: { enabled: true },
  plugins: [adminPlugin()],
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
} satisfies BetterAuthOptions;

export type Auth = BetterAuth<typeof authOptions>;

@Injectable()
export class AuthService {
  readonly betterAuth: Auth;

  constructor(private readonly dataSource: DataSource) {
    this.betterAuth = betterAuthFactory({
      ...authOptions,
      database: typeormAdapter(this.dataSource),
    });
  }

  async getSessionFromHeaders(headers: IncomingHttpHeaders) {
    return this.betterAuth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }
}
