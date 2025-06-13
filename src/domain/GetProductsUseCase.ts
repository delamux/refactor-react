import { Product } from './Product.ts';
import { ProductRepository } from './ProductRepository.ts';

export class GetProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
