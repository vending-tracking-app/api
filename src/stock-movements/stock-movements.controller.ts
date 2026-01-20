import { Controller, Post, Body } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constant';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { SUCCESS_RESULT } from '../constants/success-result.constant';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() createStockMovementDto: CreateStockMovementDto,
  ): Promise<typeof SUCCESS_RESULT> {
    await this.stockMovementsService.create(createStockMovementDto);
    return SUCCESS_RESULT;
  }
}
