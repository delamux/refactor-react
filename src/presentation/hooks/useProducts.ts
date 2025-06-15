import { useCallback, useEffect, useState } from 'react';
import { useReload } from './useReload.ts';
import { Product, ProductPrimitives, ProductStatus } from '../../domain/Product.ts';
import { GetProductsUseCase } from '../../domain/GetProductsUseCase.ts';
import { useAppContext } from '../context/useAppContext.ts';
import { GetProductByIdUseCase } from '../../domain/GetProductByIdUseCase.ts';
import { ProductNotFoundError } from '../../domain/ProductRepository.ts';
import { Price, ValidationError } from '../../domain/valueObjects/Price.ts';

export type ProductViewModel = ProductPrimitives & { status: ProductStatus };

export const useProducts = (getProductsUseCase: GetProductsUseCase, getProductByIdUseCase: GetProductByIdUseCase) => {
  const { currentUser } = useAppContext();

  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [reloadKey, reload] = useReload();
  const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);

  const [error, setError] = useState<string>();
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getProductsUseCase.execute().then(p => setProducts(p.map(buildProductViewModel)));
  }, [reloadKey, getProductsUseCase]);

  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id) {
        if (!currentUser.isAdmin) {
          setError('Only admin users can edit the price of a product');
          return;
        }
        try {
          const product = await getProductByIdUseCase.execute(id);
          setEditingProduct(buildProductViewModel(product));
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

  function onChangePrice(price: string) {
    if (!editingProduct) return;
    try {
      setEditingProduct({ ...editingProduct, price });
      Price.create(price);
      setPriceError(undefined);
    } catch (error) {
      if (error instanceof ValidationError) {
        setPriceError(error.message);
      } else {
        setError('Unknown error occurred while updating product quantity');
      }
    }
  }

  return {
    products,
    reload,
    updatingQuantity,
    editingProduct,
    setEditingProduct,
    error,
    cancelEditPrice,
    priceError,
    onChangePrice,
  };
};

function buildProductViewModel(product: Product): ProductViewModel {
  return {
    ...product,
    price: product.price.value.toFixed(2),
  };
}
