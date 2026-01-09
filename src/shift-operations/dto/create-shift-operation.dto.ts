import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { ShiftOperationType } from '../constants/shift-operation-type.constant';

class CreateShiftOperationSnapshotItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
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

  @Type(() => CreateShiftOperationSnapshotItemDto)
  @IsArray()
  @ValidateNested({ each: true })
  snapshot: CreateShiftOperationSnapshotItemDto[];
}
