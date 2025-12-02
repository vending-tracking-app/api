import { Machine } from './entities/machine.entity';
import { MachineResponseDto } from './dto/machine-response.dto';

export class MachinesMapper {
  static toResponse(machine: Machine): MachineResponseDto {
    const dto = new MachineResponseDto();
    dto.id = machine.id;
    dto.name = machine.name;
    dto.location = machine.location;
    dto.createdAt = machine.createdAt.toISOString();
    dto.updatedAt = machine.updatedAt.toISOString();
    return dto;
  }
}

