class MachineStockResponseItemDto {
  productId: string;
  quantity: number;
}

export class MachineStockResponseDto {
  stock: MachineStockResponseItemDto[];
}
