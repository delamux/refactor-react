import { useCallback, useEffect, useState } from 'react';
import { useReload } from './useReload.ts';
import { Product } from '../../domain/Product.ts';
import { GetProductsUseCase } from '../../domain/GetProductsUseCase.ts';
import { useAppContext } from '../context/useAppContext.ts';
import { GetProductByIdUseCase } from '../../domain/GetProductByIdUseCase.ts';
import { ProductNotFoundError } from '../../domain/ProductRepository.ts';

export const useProducts = (getProductsUseCase: GetProductsUseCase, getProductByIdUseCase: GetProductByIdUseCase) => {
  const { currentUser } = useAppContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [reloadKey, reload] = useReload();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const [error, setError] = useState<string>();

  useEffect(() => {
    getProductsUseCase.execute().then(setProducts);
  }, [reloadKey, getProductsUseCase]);

  useEffect(() => {}, []);

  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id) {
        if (!currentUser.isAdmin) {
          setError('Only admin users can edit the price of a product');
          return;
        }
        try {
          const product = await getProductByIdUseCase.execute(id);
          setEditingProduct(product);
        } catch (error) {
          if (error instanceof ProductNotFoundError) {
            setError(error.message);
          } else {
            setError('Unknown error occurred while updating product quantity');
          }
        }
      }
    },
    [currentUser, getProductByIdUseCase]
  );

  const cancelEditPrice = useCallback(() => {
    setEditingProduct(undefined);
  }, [setEditingProduct]);

  return { products, reload, updatingQuantity, editingProduct, setEditingProduct, error, cancelEditPrice };
};
