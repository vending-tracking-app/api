import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { DbModule } from './db/db.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(),
    },
  ],
})
export class AppModule {}
