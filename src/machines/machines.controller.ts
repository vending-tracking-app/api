import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constant';
import { MachinesService } from './machines.service';
import { MachineResponseDto } from './dto/machine-response.dto';
import { MachinesMapper } from './machines.mapper';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Roles(UserRole.ADMIN)
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async findAll(): Promise<MachineResponseDto[]> {
    const machines = await this.machinesService.findAll();
    return machines.map((machine) => MachinesMapper.toResponse(machine));
  }

  @Post()
  async create(
    @Body() createMachineDto: CreateMachineDto,
  ): Promise<MachineResponseDto> {
    const machine = await this.machinesService.create(createMachineDto);
    return MachinesMapper.toResponse(machine);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ): Promise<MachineResponseDto> {
    const machine = await this.machinesService.update(id, updateMachineDto);
    return MachinesMapper.toResponse(machine);
  }
}
