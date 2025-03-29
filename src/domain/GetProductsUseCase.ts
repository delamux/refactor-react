import { RemoteProduct, StoreApi } from '../data/api/StoreApi.ts';
import { Product } from './Product.ts';

export class GetProductsUseCase {
  constructor(private readonly storeApi: StoreApi) {}

  async execute(): Promise<Product[]> {
    const response = await this.storeApi.getAll();
    const remoteProducts = response as RemoteProduct[];

    return remoteProducts.map(buildProduct);
  }
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
  return {
    id: remoteProduct.id,
    title: remoteProduct.title,
    image: remoteProduct.image,
    price: remoteProduct.price.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }),
  };
}
