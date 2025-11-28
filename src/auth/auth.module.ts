import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionsRepository } from './sessions.repository';

@Module({
  imports: [DbModule],
  controllers: [AuthController],
  providers: [AuthService, SessionsRepository],
  exports: [AuthService],
})
export class AuthModule {}
