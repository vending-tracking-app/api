import { ShiftOperation } from './entities/shift-operation.entity';
import { ShiftOperationResponseDto } from './dto/shift-operation-response.dto';
import {
  ShiftOperationDetailResponseDto,
  StockMovementResponseDto,
  StockMovementItemResponseDto,
} from './dto/shift-operation-detail-response.dto';
import { StockMovement } from '../stock-movements/entities/stock-movement.entity';
import { StockMovementItem } from '../stock-movements/entities/stock-movement-item.entity';

export class ShiftOperationsMapper {
  static toResponse(shiftOperation: ShiftOperation): ShiftOperationResponseDto {
    const dto = new ShiftOperationResponseDto();
    dto.id = shiftOperation.id;
    dto.createdAt = shiftOperation.createdAt.toISOString();
    dto.updatedAt = shiftOperation.updatedAt.toISOString();
    dto.type = shiftOperation.type;
    dto.machineId = shiftOperation.machineId;
    dto.createdById = shiftOperation.createdById;
    dto.note = shiftOperation.note;
    dto.cashCollected = shiftOperation.cashCollected;
    return dto;
  }

  static toMovementItemResponse(
    item: StockMovementItem,
  ): StockMovementItemResponseDto {
    const dto = new StockMovementItemResponseDto();
    dto.id = item.id;
    dto.movementId = item.movementId;
    dto.productId = item.productId;
    dto.quantity = item.quantity;
    return dto;
  }

  static toMovementResponse(movement: StockMovement): StockMovementResponseDto {
    const dto = new StockMovementResponseDto();
    dto.id = movement.id;
    dto.createdAt = movement.createdAt.toISOString();
    dto.updatedAt = movement.updatedAt.toISOString();
    dto.fromWarehouseId = movement.fromWarehouseId;
    dto.toWarehouseId = movement.toWarehouseId;
    dto.type = movement.type;
    dto.createdById = movement.createdById;
    dto.note = movement.note;
    dto.shiftOperationId = movement.shiftOperationId;
    dto.items = (movement.items ?? []).map((item) =>
      ShiftOperationsMapper.toMovementItemResponse(item),
    );
    return dto;
  }

  static toDetailResponse(
    shiftOperation: ShiftOperation & {
      stockMovements?: (StockMovement & { items?: StockMovementItem[] })[];
    },
  ): ShiftOperationDetailResponseDto {
    const dto = new ShiftOperationDetailResponseDto();
    dto.id = shiftOperation.id;
    dto.createdAt = shiftOperation.createdAt.toISOString();
    dto.updatedAt = shiftOperation.updatedAt.toISOString();
    dto.type = shiftOperation.type;
    dto.machineId = shiftOperation.machineId;
    dto.createdById = shiftOperation.createdById;
    dto.note = shiftOperation.note;
    dto.cashCollected = shiftOperation.cashCollected;
    dto.stockMovements = (shiftOperation.stockMovements ?? []).map((movement) =>
      ShiftOperationsMapper.toMovementResponse(movement),
    );
    return dto;
  }
}
