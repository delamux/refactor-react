import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "../../App";

test("Loads and displays title", () => {
    render(<App />);

    const titleElement = screen.getByRole("heading", { name: /product price updater/i });
    expect(titleElement).toBeInTheDocument();
});
