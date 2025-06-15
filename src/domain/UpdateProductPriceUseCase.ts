import { ProductRepository } from './ProductRepository.ts';
import { User } from '../presentation/context/AppContext.tsx';

export class ActionNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActionNotAllowedError';
  }
}

export class UpdateProductPriceUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(user: User, id: number, price: string): Promise<void> {
    if (!user.isAdmin) {
      throw new ActionNotAllowedError('Only admin can update product price');
    }

    const remoteProduct = await this.repository.get(id);

    const editedProduct = remoteProduct.editPrice(price);

    return this.repository.save(editedProduct);
  }
}
