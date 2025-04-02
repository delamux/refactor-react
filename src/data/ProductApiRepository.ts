import { RemoteProduct, StoreApi } from "./api/StoreApi.ts";
import { Product } from "../domain/Product.ts";
import { ProductRepository } from "../domain/ProductRepository.ts";

export class ProductApiRepository implements ProductRepository {
  constructor(private readonly storeApi: StoreApi) {}

  async getAll(): Promise<Product[]> {
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
