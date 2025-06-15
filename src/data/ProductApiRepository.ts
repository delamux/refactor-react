import { RemoteProduct, StoreApi } from './api/StoreApi.ts';
import { Product } from '../domain/Product.ts';
import { ProductRepository } from '../domain/ProductRepository.ts';

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
    const remoteProduct: RemoteProduct = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: parseFloat(product.price.value.toString()),
      description: '',
      category: '',
      rating: { rate: 0, count: 0 },
    };

    await this.storeApi.post(remoteProduct);
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
