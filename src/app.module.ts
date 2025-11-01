import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(),
    },
  ],
})
export class AppModule {}
