class UserStockResponseItemDto {
  productId: string;
  quantity: number;
}

export class UserStockResponseDto {
  stock: UserStockResponseItemDto[];
}
