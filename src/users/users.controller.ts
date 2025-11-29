import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersMapper } from './users.mapper';

@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
