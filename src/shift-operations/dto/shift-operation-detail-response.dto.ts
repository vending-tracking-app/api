import { StockMovementType } from '../../stock-movements/constants/stock-movement-type.constant';
import { ShiftOperationType } from '../constants/shift-operation-type.constant';

export class StockMovementItemResponseDto {
  id: string;
  movementId: string;
  productId: string;
  quantity: number;
}

export class StockMovementResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  type: StockMovementType;
  createdById: string;
  note: string | null;
  shiftOperationId: string | null;
  items: StockMovementItemResponseDto[];
}

export class ShiftOperationDetailResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: ShiftOperationType;
  machineId: string;
  createdById: string;
  note: string | null;
  cashCollected: number | null;
  stockMovements: StockMovementResponseDto[];
}
