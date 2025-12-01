import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersMapper } from './users.mapper';
import { UserRole } from '../auth/constants/user-role.constant';

@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return UsersMapper.toResponse(user);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => UsersMapper.toResponse(user));
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return UsersMapper.toResponse(user);
  }
}
