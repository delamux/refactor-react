import { Price } from './valueObjects/Price.ts';
import { Entity } from './valueObjects/Entity.ts';

export type ProductStatus = 'active' | 'inactive';

export interface ProductPrimitives {
  id: number;
  title: string;
  image: string;
  price: string;
}

export type ProductEntity = Omit<ProductPrimitives, 'price'> & {
  price: Price;
  status: ProductStatus;
};

export class Product extends Entity {
  public readonly id: number;
  public readonly title: string;
  public readonly image: string;
  public readonly price: Price;
  public readonly status: ProductStatus;

  private constructor(props: ProductEntity) {
    super(props.id)
    this.id = props.id;
    this.title = props.title;
    this.image = props.image;
    this.price = props.price
    this.status = props.status
  }

  public static create(props: ProductPrimitives): Product {
    const price = Price.create(props.price);
    return new Product({
      ...props,
      price,
      status: price.value === 0 ? 'inactive' : 'active'
    });
  }

}
