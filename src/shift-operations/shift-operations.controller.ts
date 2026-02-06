import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constant';
import { ShiftOperationsService } from './shift-operations.service';
import { CreateShiftOperationDto } from './dto/create-shift-operation.dto';
import { ShiftOperationResponseDto } from './dto/shift-operation-response.dto';
import { ShiftOperationDetailResponseDto } from './dto/shift-operation-detail-response.dto';
import { ShiftOperationsMapper } from './shift-operations.mapper';
import { SUCCESS_RESULT } from '../constants/success-result.constant';

@Roles(UserRole.ADMIN)
@Controller('shift-operations')
export class ShiftOperationsController {
  constructor(
    private readonly shiftOperationsService: ShiftOperationsService,
  ) {}

  @Get()
  async findAll(
    @Query('machineId') machineId: string,
  ): Promise<ShiftOperationResponseDto[]> {
    const shiftOperations =
      await this.shiftOperationsService.findByMachineId(machineId);
    return shiftOperations.map((operation) =>
      ShiftOperationsMapper.toResponse(operation),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ShiftOperationDetailResponseDto> {
    const shiftOperation =
      await this.shiftOperationsService.findOneByIdOrThrow(id);
    return ShiftOperationsMapper.toDetailResponse(shiftOperation);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  async create(
    @Body() createShiftOperationDto: CreateShiftOperationDto,
  ): Promise<typeof SUCCESS_RESULT> {
    await this.shiftOperationsService.create(createShiftOperationDto);
    return SUCCESS_RESULT;
  }
}
