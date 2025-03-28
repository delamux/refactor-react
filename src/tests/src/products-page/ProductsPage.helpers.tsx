import { screen, waitFor, within } from '@testing-library/react';
import { expect } from 'vitest';
import { RemoteProduct } from '../../../api/StoreApi.ts';

export function verifyHeaders(headerRow: HTMLElement) {
  const headerScope = within(headerRow);

  const cells = headerScope.getAllByRole('columnheader');
  //Remember to have columnBuffer property in the dataGrid
  expect(cells.length).toBe(6);

  within(cells[0]).getByText('ID');
  within(cells[1]).getByText('Title');
  within(cells[2]).getByText('Image');
  within(cells[3]).getByText('Price');
  within(cells[4]).getByText('Status');
}

export function verifyRows(rows: HTMLElement[], products: RemoteProduct[]) {
  expect(rows.length).toBe(products.length);

  rows.forEach((row, index) => {
    const product = products[index];
    const rowScope = within(row);
    const cells = rowScope.getAllByRole('cell');
    expect(cells.length).toBe(6);

    within(cells[0]).getByText(product.id.toString());
    within(cells[1]).getByText(product.title);
    const image: HTMLImageElement = within(cells[2]).getByRole('img');
    expect(image.src).toBe(product.image);
    within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
    within(cells[4]).getByText(product.price === 0 ? 'inactive' : 'active');
  });
}

export async function waitForTableIsLoaded() {
  await waitFor(async () => {
    const rowsLength = (await screen.findAllByRole('row')).length;
    expect(rowsLength).toBeGreaterThan(1);
  });
}
