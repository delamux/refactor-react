import { useEffect, useState } from "react";
import { useReload } from "./useReload.ts";
import { Product } from "../../domain/Product.ts";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase.ts";

export const useProducts = (getProductsUseCase: GetProductsUseCase) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reloadKey, reload] = useReload();

  useEffect(() => {
    getProductsUseCase.execute().then(setProducts);
  }, [reloadKey, getProductsUseCase]);

  return { products, reload };
}
