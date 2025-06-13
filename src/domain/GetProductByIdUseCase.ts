import { ProductRepository } from './ProductRepository.ts';
import { Product } from './Product.ts';

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}

export class GetProductByIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    try {
      return  await this.repository.get(id.toString());
    }
    catch (error) {
      throw new ProductNotFoundError(`Product with id ${id} not found`);
    }

  }
}
