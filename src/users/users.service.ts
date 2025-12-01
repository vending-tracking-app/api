import { ConflictException, Injectable } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { UsersRepository } from './users.repository';
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

  async create(data: CreateUserParams): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.authService.createUser(data);

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    const user = await this.usersRepository.findOne({
      where: { id: newUser.user.id },
    });

    if (!user) {
      throw new Error('User created but not found in database');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
