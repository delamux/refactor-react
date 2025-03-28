import { within } from "@testing-library/react";
import { expect } from "vitest";

export function verifyHeaders(headerRow: HTMLElement) {
    const headerScope = within(headerRow);

    const cells = headerScope.getAllByRole("columnheader");
    //Remember to have columnBuffer property in the dataGrid
    expect(cells.length).toBe(6);

    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
}
