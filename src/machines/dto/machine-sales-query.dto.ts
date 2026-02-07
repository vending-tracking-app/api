import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class MachineSalesQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;
}
