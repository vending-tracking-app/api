import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constant';
import { ProductsService } from './products.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsMapper } from './products.mapper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Roles(UserRole.ADMIN)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll();
    return products.map((product) => ProductsMapper.toResponse(product));
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOneByOrThrow({ id });
    return ProductsMapper.toResponse(product);
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return ProductsMapper.toResponse(product);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return ProductsMapper.toResponse(product);
  }
}
