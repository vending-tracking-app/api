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

import { StockMovementType } from '../constants/stock-movement-type.constant';

class CreateStockMovementItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateStockMovementDto {
  @IsOptional()
  @IsUUID()
  fromId?: string;

  @IsOptional()
  @IsUUID()
  toId?: string;

  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsOptional()
  @IsString()
  note?: string;

  @Type(() => CreateStockMovementItemDto)
  @IsArray()
  @ValidateNested({ each: true })
  items: CreateStockMovementItemDto[];
}
