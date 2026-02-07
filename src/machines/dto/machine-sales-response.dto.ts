export class MachineSalesPointResponseDto {
  date: string;
  units: number;
}

export class MachineSalesSeriesResponseDto {
  productId: string;
  productName: string;
  points: MachineSalesPointResponseDto[];
}

export class MachineSalesResponseDto {
  series: MachineSalesSeriesResponseDto[];
}
