import { Controller, Post, Body } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constant';
import { ShiftOperationsService } from './shift-operations.service';
import { CreateShiftOperationDto } from './dto/create-shift-operation.dto';
import { SUCCESS_RESULT } from '../constants/success-result.constant';

@Roles(UserRole.ADMIN, UserRole.USER)
@Controller('shift-operations')
export class ShiftOperationsController {
  constructor(
    private readonly shiftOperationsService: ShiftOperationsService,
  ) {}

  @Post()
  async create(
    @Body() createShiftOperationDto: CreateShiftOperationDto,
  ): Promise<typeof SUCCESS_RESULT> {
    await this.shiftOperationsService.create(createShiftOperationDto);
    return SUCCESS_RESULT;
  }
}
