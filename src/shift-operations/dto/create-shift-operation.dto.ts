import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

import { ShiftOperationType } from '../constants/shift-operation-type.constant';

class CreateShiftOperationSnapshotItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number;
}

export class CreateShiftOperationDto {
  @IsUUID()
  machineId: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsEnum(ShiftOperationType)
  type: ShiftOperationType;

  @IsOptional()
  @IsInt()
  @Min(0)
  cashCollected?: number;

  @Type(() => CreateShiftOperationSnapshotItemDto)
  @IsArray()
  @ValidateNested({ each: true })
  snapshot: CreateShiftOperationSnapshotItemDto[];
}
