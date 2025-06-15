import { ProductRepository } from './ProductRepository.ts';
import { User } from '../presentation/context/AppContext.tsx';
import { Product } from './Product.ts';

export class ActionNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActionNotAllowedError';
  }
}

export class UpdateProductPriceUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(user: User, product: Product): Promise<void> {
    if (!user.isAdmin) {
      throw new ActionNotAllowedError('Only admin can update product price');
    }

    return this.repository.save(product);
  }
}
