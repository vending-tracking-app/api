import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { User } from './entities/user.entity';
import { UserRole } from '../auth/constants/user-role.constant';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

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

  async create(data: CreateUserParams): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = await this.authService.createUser(data);
    return this.findOneByOrThrow({ id: newUser.user.id });
  }
}
