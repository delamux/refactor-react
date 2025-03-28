import { screen, waitFor, within } from '@testing-library/react';
import { expect } from 'vitest';
import { RemoteProduct } from '../../../api/StoreApi.ts';
import userEvent from '@testing-library/user-event';

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

export function verifyDialog(dialog: HTMLElement, product: RemoteProduct) {
  const dialogScope = within(dialog);

  dialogScope.getByText(product.title);
  const image: HTMLImageElement = dialogScope.getByRole('img');
  expect(image.src).toBe(product.image);
  const price: HTMLInputElement = screen.getByRole('textbox');
  expect(price.value).toBe(`${product.price.toFixed(2)}`);
}

export async function openDialogToEditPrice(productIndex: number): Promise<HTMLElement> {
  const allRows = await screen.getAllByRole('row');
  const [, ...rows] = allRows;

  const row = rows[productIndex];
  const rowScope = within(row);

  await userEvent.click(rowScope.getByRole('menuitem'));

  const updatePriceMenuItem = await screen.findByRole('menuitem', { name: /update price/i });

  await userEvent.click(updatePriceMenuItem);

  return screen.getByRole('dialog');
}

export async function insertPrice(dialog: HTMLElement, negativePrice: string) {
  const dialogScope = within(dialog);
  const priceInput: HTMLInputElement = dialogScope.getByRole('textbox', { name: 'Price' });

  await userEvent.clear(priceInput);
  await userEvent.type(priceInput, negativePrice);
}

export function verifyError(dialog: HTMLElement, error: string) {
  const dialogScope = within(dialog);
  dialogScope.findByText(error);
}
