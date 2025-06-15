import { Product } from './Product.ts';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  get(id: number): Promise<Product>;
  save(product: Product): Promise<void>;
}

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}
