import { useCallback, useEffect, useState } from 'react';
import { useReload } from './useReload.ts';
import { Product } from '../../domain/Product.ts';
import { GetProductsUseCase } from '../../domain/GetProductsUseCase.ts';
import { useAppContext } from '../context/useAppContext.ts';
import { GetProductByIdUseCase } from '../../domain/GetProductByIdUseCase.ts';
import { ProductNotFoundError } from '../../domain/ProductRepository.ts';
import { Price, ValidationError } from '../../domain/valueObjects/Price.ts';
import { ActionNotAllowedError, UpdateProductPriceUseCase } from '../../domain/UpdateProductPriceUseCase.ts';
import { Message, ProductViewModel, UseProducts } from './useProductsState.ts';

export const useProducts = (
  getProductsUseCase: GetProductsUseCase,
  getProductByIdUseCase: GetProductByIdUseCase,
  getEditProductUseCase: UpdateProductPriceUseCase
): UseProducts => {
  const { currentUser } = useAppContext();

  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [reloadKey, reload] = useReload();
  const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);

  const [message, setMessage] = useState<Message>();
  const [priceError, setPriceError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getProductsUseCase.execute().then(p => setProducts(p.map(buildProductViewModel)));
  }, [reloadKey, getProductsUseCase]);

  const updatingQuantity = useCallback(
    async (id: number) => {
      if (id) {
        if (!currentUser.isAdmin) {
          setMessage({ type: 'error', text: 'Only admin users can edit the price of a product' });
          return;
        }
        try {
          const product = await getProductByIdUseCase.execute(id);
          setEditingProduct(buildProductViewModel(product));
        } catch (error) {
          if (error instanceof ProductNotFoundError) {
            setMessage({ type: 'error', text: error.message });
          } else {
            setMessage({ type: 'error', text: 'Unknown error occurred while updating product quantity' });
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
        setMessage({ type: 'error', text: 'Unknown error occurred while updating product quantity' });
      }
    }
  }

  const saveEditPrice = useCallback(async () => {
    if (editingProduct) {
      try {
        await getEditProductUseCase.execute(currentUser, Product.create(editingProduct));

        setMessage({ type: 'success', text: `Price ${editingProduct.price} for '${editingProduct.title}' updated` });
        setEditingProduct(undefined);
        reload();
      } catch (error) {
        if (error instanceof ActionNotAllowedError) {
          setMessage({
            type: 'error',
            text: error.message,
          });
        } else {
          setMessage({
            type: 'error',
            text: `An error has occurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
          });
        }
        setEditingProduct(undefined);
        reload();
      }
    }
  }, [editingProduct, currentUser, getEditProductUseCase, reload]);

  const oncloseMessage = useCallback(() => {
    setMessage(undefined);
  }, []);

  return {
    products,
    updatingQuantity,
    editingProduct,
    message,
    cancelEditPrice,
    priceError,
    onChangePrice,
    saveEditPrice,
    oncloseMessage,
  };
};

function buildProductViewModel(product: Product): ProductViewModel {
  return {
    ...product,
    price: product.price.value.toFixed(2),
  };
}
