import { render, RenderResult, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ProductsPage } from '../../../pages/ProductsPage.tsx';
import { AppProvider } from '../../../context/AppProvider.tsx';
import { ReactNode } from 'react';
import { givenEmptyProducts, givenProducts } from './ProductsPage.fixture.ts';
import { MockWebServer } from '../../MockWebServer.ts';
import {
  changeUserRoleToNonAdmin,
  insertPrice,
  openDialogToEditPrice, savePrice, tryToOpenDialogToEditPrice,
  verifyDialog,
  verifyError,
  verifyHeaders, verifyProductPriceAndStatus,
  verifyRows,
  waitForTableIsLoaded,
} from "./ProductsPage.helpers.tsx";
import { RemoteProduct } from '../../../api/StoreApi.ts';

export const mockWebServer = new MockWebServer();

describe('Products Page component', () => {
  beforeAll(() => mockWebServer.start());
  afterEach(() => mockWebServer.resetHandlers());
  afterAll(() => mockWebServer.close());

  it('Loads and displays title', async () => {
    givenProducts(mockWebServer);
    renderComponent(<ProductsPage />);

    const titleElement = await screen.getByRole('heading', { name: /product price updater/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('Should return only table headers when no products data', async () => {
    givenEmptyProducts(mockWebServer);

    renderComponent(<ProductsPage />);
    const rows = await screen.findAllByRole('row');

    verifyHeaders(rows[0]);
    expect(rows.length).toBe(1);
  });

  it('Should return only table headers when no products data', async () => {
    const products = givenProducts(mockWebServer);
    renderComponent(<ProductsPage />);

    await waitForTableIsLoaded();
    const allRows = await screen.findAllByRole('row');

    const [header, ...rows] = allRows;

    verifyHeaders(header);
    verifyRows(rows, products);
  });
});

describe('Edit Price dialog', () => {
  let products: RemoteProduct[];

  beforeEach(async () => {
    products = givenProducts(mockWebServer);
    renderComponent(<ProductsPage />);
    await waitForTableIsLoaded();
  });

  it('Should open the dialog when clicking on the edit button', async () => {
    const productIndex = 0;

    const dialog = await openDialogToEditPrice(productIndex);

    verifyDialog(dialog, products[productIndex]);
  });

  it('Should show error for a negative price', async () => {
    const productIndex = 0;
    const dialog = await openDialogToEditPrice(productIndex);

    const negativePrice = '-1';
    await insertPrice(dialog, negativePrice);
    verifyError(dialog, 'Invalid price format');
  });

  it('Should show error for a price above the maximum value', async () => {
    const productIndex = 0;
    const dialog = await openDialogToEditPrice(productIndex);

    const overPriceValueAllowed = '1000';
    await insertPrice(dialog, overPriceValueAllowed);
    verifyError(dialog, 'The max possible price is 999.99');
  });

  it('Should show error for a not number character', async () => {
    const productIndex = 0;
    const dialog = await openDialogToEditPrice(productIndex);

    const notValidNumber = 'a';
    await insertPrice(dialog, notValidNumber);
    verifyError(dialog, 'Only numbers are allowed');
  });

  it('Should edit the product to a valid price 130.99 and show the status active', async () => {
    const productIndex = 0;
    const dialog = await openDialogToEditPrice(productIndex);

    const validPrice = '130.99';
    await insertPrice(dialog, validPrice);
    await savePrice(dialog);


    const allRows = await screen.findAllByRole('row');

    const [, ...rows] = allRows;
    verifyProductPriceAndStatus(rows[productIndex], validPrice, 'active');
  });

  it('Should edit the price to $0.00 and show the status inactive', async () => {
    const productIndex = 0;
    const dialog = await openDialogToEditPrice(productIndex);

    const validPrice = '0.00';
    await insertPrice(dialog, validPrice);
    await savePrice(dialog);


    const allRows = await screen.findAllByRole('row');

    const [, ...rows] = allRows;
    verifyProductPriceAndStatus(rows[productIndex], validPrice, 'inactive');
  });

  it('Should show an error when edit price for NON ADMIN USER', async () => {
    const productIndex = 0;
    await changeUserRoleToNonAdmin();
    await tryToOpenDialogToEditPrice(productIndex);
    screen.getByText(/only admin users can edit the price of a product/i)
  });
});

function renderComponent(component: ReactNode): RenderResult {
  return render(<AppProvider>{component}</AppProvider>);
}
