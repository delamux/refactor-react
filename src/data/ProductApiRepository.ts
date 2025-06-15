import { RemoteProduct, StoreApi } from './api/StoreApi.ts';
import { Product } from '../domain/Product.ts';
import { ProductNotFoundError, ProductRepository } from '../domain/ProductRepository.ts';

export class ProductApiRepository implements ProductRepository {
  constructor(private readonly storeApi: StoreApi) {}

  async getAll(): Promise<Product[]> {
    const response = await this.storeApi.getAll();
    const remoteProducts = response as RemoteProduct[];

    return remoteProducts.map(buildProduct);
  }

  async get(id: number): Promise<Product> {
    const response = await this.storeApi.get(id);

    return buildProduct(response);
  }

  async save(product: Product): Promise<void> {
    const remoteProduct = await this.storeApi.get(product.id);

    if (!remoteProduct) {
      throw new ProductNotFoundError('Product not found on saving');
    }

    const editedProduct = {
      ...remoteProduct,
      ...product,
      price: product.price.value,
    };

    return this.storeApi.post(editedProduct);
  }
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
  return Product.create({
    id: remoteProduct.id,
    title: remoteProduct.title,
    image: remoteProduct.image,
    price: remoteProduct.price.toString(),
  });
}
