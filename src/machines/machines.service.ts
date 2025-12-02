import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { MachinesRepository } from './machines.repository';
import { Machine } from './entities/machine.entity';

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
  constructor(private readonly machinesRepository: MachinesRepository) {}

  async findAll(): Promise<Machine[]> {
    return this.machinesRepository.find();
  }

  async findOneByOrThrow(where: FindOptionsWhere<Machine>): Promise<Machine> {
    const machine = await this.machinesRepository.findOne({ where });

    if (!machine) {
      throw new Error('Machine not found');
    }

    return machine;
  }

  async create(params: CreateMachineParams): Promise<Machine> {
    const { name, location } = params;
    const machine = this.machinesRepository.create({ name, location });
    return this.machinesRepository.save(machine);
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
