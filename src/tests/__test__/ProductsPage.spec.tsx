import { render, RenderResult, screen } from "@testing-library/react";
import { test, expect, describe, beforeAll, afterAll, afterEach } from "vitest";
import { ProductsPage } from "../../pages/ProductsPage.tsx";
import { AppProvider } from "../../context/AppProvider.tsx";
import { ReactNode } from "react";
import { MockWebServer } from "../MockWebServer.ts";
import productsResponse from "./data/productsResponse.json";

const mockWebServer = new MockWebServer();

describe("Products Page component", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());
    test("Loads and displays title", () => {
        givenProducts();
        renderComponent(<ProductsPage />);

        const titleElement = screen.getByRole("heading", { name: /product price updater/i });
        expect(titleElement).toBeInTheDocument();
    });
});

function givenProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            response: productsResponse,
            httpStatusCode: 200,
        },
    ]);
}

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
