import { Product } from './Product.ts';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  get(id: number): Promise<Product>;
}

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}
