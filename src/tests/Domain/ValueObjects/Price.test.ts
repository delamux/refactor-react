import { describe, it, expect } from 'vitest';
import { Price, ValidationError } from '../../../domain/valueObjects/Price.ts';

describe('Price Value Object', () => {
  it('Should create a valid Price object', () => {
    const price = Price.create('123.45');
    expect(price.value).toBe(123.45);
  })

  it('Should throw an error for negative number', () => {
    expect(
      () => Price.create('-123.45')
    ).toThrowError(new ValidationError('Invalid price format'));
  });
  it('Should throw an error for numbers bigger than 999.000', () => {

    expect(() => Price.create('1000')).toThrowError(new ValidationError('The max possible price is 999.99'));
  })
  it('Should throw an error Only number allowed', () => {
    expect(() => Price.create('adsads')).toThrowError(new ValidationError('Only numbers are allowed'));
  });
})
