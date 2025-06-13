import { ValueObject } from './ValueObject.ts';

export class ValidationError extends Error {}

const priceRegex = /^\d+(\.\d{1,2})?$/;

export type PriceProps = {
  value: number;
};

export class Price extends ValueObject<PriceProps> {
  public readonly value: number;

  private constructor(props: PriceProps) {
    super(props);
    this.value = props.value;
  }

  public static create(value: string): Price {
    const price = Number(value);
    this.validate(value);

    return new Price({ value: Number(price) });
  }

  private static validate(value: string): void {
    const isValidNumber = !isNaN(+value);
    if (!isValidNumber) {
      throw new ValidationError('Only numbers are allowed');
    } else {
      if (!priceRegex.test(`${value}`)) {
        throw new ValidationError('Invalid price format');
      }

      if (Number(value) > 999.99) {
        throw new ValidationError('The max possible price is 999.99');
      }
    }
  }
}
