import { ShiftOperationType } from '../constants/shift-operation-type.constant';

export class ShiftOperationResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: ShiftOperationType;
  machineId: string;
  createdById: string;
  note: string | null;
  cashCollected: number | null;
}
