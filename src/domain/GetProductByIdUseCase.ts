import { ProductNotFoundError, ProductRepository } from './ProductRepository.ts';
import { Product } from './Product.ts';

export class GetProductByIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    try {
      return await this.repository.get(id);
    } catch (error) {
      throw new ProductNotFoundError(`Product with id ${id} not found`);
    }
  }
}
