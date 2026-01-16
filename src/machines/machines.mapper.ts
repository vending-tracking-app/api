import { Machine } from './entities/machine.entity';
import { MachineResponseDto } from './dto/machine-response.dto';
import { WarehouseProduct } from '../warehouses/entities/warehouse-product.entity';
import { MachineStockResponseDto } from './dto/machine-stock-response.dto';

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

export class MachineStocksMapper {
  static toResponse(
    warehouseProducts: WarehouseProduct[],
  ): MachineStockResponseDto {
    const dto = new MachineStockResponseDto();
    dto.stock = warehouseProducts.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));
    return dto;
  }
}
