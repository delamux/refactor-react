// REFACTOR: build mapper
import { RemoteProduct, StoreApi } from "../../data/api/StoreApi.ts";
import { useEffect, useState } from "react";
import { useReload } from "./useReload.ts";


export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
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

export const useProducts = (storeApi: StoreApi) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reloadKey, reload] = useReload();

  useEffect(() => {
    storeApi.getAll().then(response => {

      const remoteProducts = response as RemoteProduct[];

      const products = remoteProducts.map(buildProduct);

      setProducts(products);
    });

  }, [reloadKey]);

  return { products, reload };
}
