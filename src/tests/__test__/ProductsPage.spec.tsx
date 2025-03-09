import { render, RenderResult, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { ProductsPage } from "../../pages/ProductsPage.tsx";
import { AppProvider } from "../../context/AppProvider.tsx";
import { ReactNode } from "react";

test("Loads and displays title", () => {
    renderComponent(<ProductsPage />);

    const titleElement = screen.getByRole("heading", { name: /product price updater/i });
    expect(titleElement).toBeInTheDocument();
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
