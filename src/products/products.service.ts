import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';

export interface CreateProductParams {
  sku: string;
  name: string;
}

export interface UpdateProductParams {
  sku?: string;
  name?: string;
}

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOneByOrThrow(where: FindOptionsWhere<Product>): Promise<Product> {
    const product = await this.productsRepository.findOne({ where });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async create(params: CreateProductParams): Promise<Product> {
    const { sku, name } = params;
    const product = this.productsRepository.create({ sku, name });
    return this.productsRepository.save(product);
  }

  async update(id: string, params: UpdateProductParams): Promise<Product> {
    const product = await this.findOneByOrThrow({ id });

    const { sku, name } = params;

    if (sku !== undefined) {
      product.sku = sku;
    }

    if (name !== undefined) {
      product.name = name;
    }

    return this.productsRepository.save(product);
  }
}
