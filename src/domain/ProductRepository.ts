import { Product } from './Product.ts';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  get(id: number): Promise<Product>;
}
