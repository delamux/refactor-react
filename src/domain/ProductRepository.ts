import { Product } from "./Product.ts";

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  get(id: string): Promise<Product>;
}
