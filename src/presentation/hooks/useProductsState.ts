import { ProductPrimitives, ProductStatus } from '../../domain/Product.ts';

export type ProductViewModel = ProductPrimitives & { status: ProductStatus };
export type Message = { type: 'success' | 'error'; text: string };

export type UseProducts = {
  products: ProductViewModel[];
  updatingQuantity: (id: number) => Promise<void>;
  editingProduct?: ProductViewModel;
  cancelEditPrice: () => void;
  message?: Message;
  priceError?: string;
  onChangePrice: (price: string) => void;
  saveEditPrice: () => Promise<void>;
  oncloseMessage: () => void;
}
