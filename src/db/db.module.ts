import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';

import dataSource from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options)],
  providers: [DbService],
})
export class DbModule {}
