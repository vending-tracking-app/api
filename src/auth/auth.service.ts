import { Injectable } from '@nestjs/common';
import {
  Auth as BetterAuth,
  betterAuth as betterAuthFactory,
  BetterAuthOptions,
} from 'better-auth';
import { admin as adminPlugin, phoneNumber } from 'better-auth/plugins';
import { fromNodeHeaders } from 'better-auth/node';
import { IncomingHttpHeaders } from 'http';
import { DataSource } from 'typeorm';

import { typeormAdapter } from './typeorm-adapter';
import { UserRole } from './constants/user-role.constant';
import { normalizePhoneNumber } from '../utils/phone-normalize';

const authOptions = {
  emailAndPassword: { enabled: true },
  plugins: [
    adminPlugin(),
    phoneNumber({
      sendOTP: ({ phoneNumber: phone, code }) => {
        // Dev-only stub: log OTP to the console
        console.log(`[Auth] OTP for ${phone}: ${code}`);
      },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone}@phone.local`,
      },
    }),
  ],
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

  async createUser(data: {
    phoneNumber: string;
    name: string;
    password: string;
    role: UserRole;
    image?: string;
  }) {
    const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);
    return this.betterAuth.api.createUser({
      body: {
        email: `${normalizedPhoneNumber}@phone.local`,
        password: data.password,
        name: data.name,
        role: data.role,
        data: {
          phoneNumber: normalizedPhoneNumber,
          image: data.image,
        },
      },
    });
  }
}
