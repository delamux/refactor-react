import { render, RenderResult, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ProductsPage } from '../../../pages/ProductsPage.tsx';
import { AppProvider } from '../../../context/AppProvider.tsx';
import { ReactNode } from 'react';
import { givenEmptyProducts, givenProducts } from './ProductsPage.fixture.ts';
import { MockWebServer } from '../../MockWebServer.ts';

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

        expect(rows.length).toBe(1);
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
