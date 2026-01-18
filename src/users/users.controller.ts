import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersMapper, UserStocksMapper } from './users.mapper';
import { UserRole } from '../auth/constants/user-role.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStockResponseDto } from './dto/user-stock-response.dto';

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
    const user = await this.usersService.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return UsersMapper.toResponse(user);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id/stock')
  async findStock(@Param('id') id: string): Promise<UserStockResponseDto> {
    const user = await this.usersService.findOneBy(
      { id },
      { warehouse: { warehouseProducts: true } },
    );

    // TODO: fix relation types
    if (!user || !user.warehouse || !user.warehouse.warehouseProducts) {
      throw new NotFoundException();
    }

    return UserStocksMapper.toResponse(user.warehouse.warehouseProducts);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return UsersMapper.toResponse(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return UsersMapper.toResponse(user);
  }
}
