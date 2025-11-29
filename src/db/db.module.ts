import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dataSource from './data-source';
import { DbService } from './db.service';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options)],
  providers: [DbService],
})
export class DbModule {}
