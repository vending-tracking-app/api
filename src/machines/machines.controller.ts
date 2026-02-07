import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constant';
import { MachinesService } from './machines.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { MachineResponseDto } from './dto/machine-response.dto';
import { MachinesMapper, MachineStocksMapper } from './machines.mapper';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachineStockResponseDto } from './dto/machine-stock-response.dto';
import { MachineSalesQueryDto } from './dto/machine-sales-query.dto';
import { MachineSalesResponseDto } from './dto/machine-sales-response.dto';

@Roles(UserRole.ADMIN)
@Controller('machines')
export class MachinesController {
  constructor(
    private readonly machinesService: MachinesService,
    private readonly stockMovementsService: StockMovementsService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async findAll(): Promise<MachineResponseDto[]> {
    const machines = await this.machinesService.findAll();
    return machines.map((machine) => MachinesMapper.toResponse(machine));
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MachineResponseDto> {
    const machine = await this.machinesService.findOneByOrThrow({ id });
    return MachinesMapper.toResponse(machine);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id/stock')
  async findStock(@Param('id') id: string): Promise<MachineStockResponseDto> {
    const machine = await this.machinesService.findOneBy(
      { id },
      { warehouse: { warehouseProducts: true } },
    );

    // TODO: fix relation types
    if (
      !machine ||
      !machine.warehouse ||
      !machine.warehouse.warehouseProducts
    ) {
      throw new NotFoundException();
    }

    return MachineStocksMapper.toResponse(machine.warehouse.warehouseProducts);
  }

  @Get(':id/sales')
  async findSales(
    @Param('id') id: string,
    @Query() query: MachineSalesQueryDto,
  ): Promise<MachineSalesResponseDto> {
    const series = await this.stockMovementsService.getMachineSales({
      machineId: id,
      from: query.from,
      to: query.to,
      productId: query.productId,
    });

    return { series };
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
