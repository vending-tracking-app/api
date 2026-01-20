import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';
import { ContextModule } from './context/context.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { MachinesModule } from './machines/machines.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { ShiftOperationsModule } from './shift-operations/shift-operations.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    DbModule,
    ContextModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    MachinesModule,
    WarehousesModule,
    StockMovementsModule,
    ShiftOperationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
