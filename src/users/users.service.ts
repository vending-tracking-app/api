import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { ConfigService } from '../config/config.service';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { WarehousesService } from '../warehouses/warehouses.service';
import { User } from './entities/user.entity';
import { UserRole } from '../auth/constants/user-role.constant';
import { WarehouseType } from '../warehouses/constants/warehouse-type.constant';
import { normalizePhoneNumber } from '../utils/phone-normalize';

export interface CreateUserParams {
  name: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  image?: string;
}

export interface UpdateUserParams {
  name?: string;
  phoneNumber?: string;
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
        phoneNumber: this.configService.get('defaultAdmin.phone'),
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

  async findOneByOrThrow(
    where: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ) {
    const user = await this.findOneBy(where, relations);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findOneBy(
    where: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ) {
    return this.usersRepository.findOne({ where, relations });
  }

  @Transactional()
  async create(data: CreateUserParams): Promise<User> {
    const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);

    const existingUser = await this.usersRepository.findOne({
      where: { phoneNumber: normalizedPhoneNumber },
    });

    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    const { user } = await this.authService.createUser({
      ...data,
      phoneNumber: normalizedPhoneNumber,
    });

    await this.warehousesService.create({
      type: WarehouseType.USER,
      userId: user.id,
    });

    return this.findOneByOrThrow({ id: user.id });
  }

  @Transactional()
  async update(id: string, data: UpdateUserParams): Promise<User> {
    const user = await this.findOneByOrThrow({ id });

    if (data.name !== undefined) {
      user.name = data.name;
    }

    if (data.phoneNumber !== undefined) {
      const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);
      const existingUser = await this.usersRepository.findOne({
        where: { phoneNumber: normalizedPhoneNumber },
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new Error('User with this phone number already exists');
      }

      user.phoneNumber = normalizedPhoneNumber;
    }

    if (data.image !== undefined) {
      user.image = data.image;
    }

    return this.usersRepository.save(user);
  }
}
