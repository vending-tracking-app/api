import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { MachinesRepository } from './machines.repository';
import { Machine } from './entities/machine.entity';
import { WarehousesService } from '../warehouses/warehouses.service';
import { WarehouseType } from '../warehouses/constants/warehouse-type.constant';

export interface CreateMachineParams {
  name: string;
  location: string;
}

export interface UpdateMachineParams {
  name?: string;
  location?: string;
}

@Injectable()
export class MachinesService {
  constructor(
    private readonly machinesRepository: MachinesRepository,
    private readonly warehousesService: WarehousesService,
  ) {}

  async findAll(): Promise<Machine[]> {
    return this.machinesRepository.find();
  }

  async findOneBy(
    where: FindOptionsWhere<Machine>,
    relations?: FindOptionsRelations<Machine>,
  ) {
    return this.machinesRepository.findOne({ where, relations });
  }

  async findOneByOrThrow(
    where: FindOptionsWhere<Machine>,
    relations?: FindOptionsRelations<Machine>,
  ) {
    const machine = await this.findOneBy(where, relations);

    if (!machine) {
      throw new Error('Machine not found');
    }

    return machine;
  }

  @Transactional()
  async create(params: CreateMachineParams): Promise<Machine> {
    const { name, location } = params;

    const machine = await this.machinesRepository.save(
      this.machinesRepository.create({ name, location }),
    );

    await this.warehousesService.create({
      type: WarehouseType.MACHINE,
      machineId: machine.id,
    });

    return machine;
  }

  async update(id: string, params: UpdateMachineParams): Promise<Machine> {
    const machine = await this.findOneByOrThrow({ id });

    const { name, location } = params;

    if (name !== undefined) {
      machine.name = name;
    }

    if (location !== undefined) {
      machine.location = location;
    }

    return this.machinesRepository.save(machine);
  }
}
