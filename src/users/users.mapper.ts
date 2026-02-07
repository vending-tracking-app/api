import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { WarehouseProduct } from '../warehouses/entities/warehouse-product.entity';
import { UserStockResponseDto } from './dto/user-stock-response.dto';

export class UsersMapper {
  static toResponse(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.createdAt = user.createdAt.toISOString();
    dto.updatedAt = user.updatedAt.toISOString();
    dto.name = user.name;
    dto.email = user.email;
    dto.phoneNumber = user.phoneNumber ?? null;
    dto.role = user.role;
    dto.image = user.image;
    return dto;
  }
}

export class UserStocksMapper {
  static toResponse(
    warehouseProducts: WarehouseProduct[],
  ): UserStockResponseDto {
    const dto = new UserStockResponseDto();
    dto.stock = warehouseProducts.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));
    return dto;
  }
}
