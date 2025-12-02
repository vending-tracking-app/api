import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule, WarehousesModule],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
