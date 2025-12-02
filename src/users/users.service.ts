import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { FindOptionsWhere } from 'typeorm';

import { ConfigService } from '../config/config.service';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { WarehousesService } from '../warehouses/warehouses.service';
import { User } from './entities/user.entity';
import { UserRole } from '../auth/constants/user-role.constant';
import { WarehouseType } from '../warehouses/constants/warehouse-type.constant';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly warehousesService: WarehousesService,
  ) {}

  async onModuleInit() {
    try {
      const existingAdmin = await this.usersRepository.findOne({
        where: { role: UserRole.ADMIN },
      });

      if (existingAdmin) {
        this.logger.log('Admin user already exists, skipping creation');
        return;
      }

      await this.create({
        email: this.configService.get('defaultAdmin.email'),
        password: this.configService.get('defaultAdmin.password'),
        name: 'Default admin',
        role: UserRole.ADMIN,
      });
    } catch (error) {
      this.logger.error('Error during default admin user creation');
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByOrThrow(where: FindOptionsWhere<User>): Promise<User> {
    const user = await this.findOneBy(where);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOne({ where });
  }

  @Transactional()
  async create(data: CreateUserParams): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const { user } = await this.authService.createUser(data);

    await this.warehousesService.create({
      type: WarehouseType.USER,
      userId: user.id,
    });

    return this.findOneByOrThrow({ id: user.id });
  }
}
