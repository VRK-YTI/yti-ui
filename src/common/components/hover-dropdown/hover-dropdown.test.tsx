import React from "react";
import { render, screen } from "@testing-library/react";
import HoverDropdown from "./hover-dropdown";
import { themeProvider } from "../../../tests/test-utils";

describe("HoverDropdown", () => {
  it("should render children", async () => {
    render(<HoverDropdown items={[]}>Children</HoverDropdown>, {
      wrapper: themeProvider,
    });

    expect(screen.queryByText("Children")).toBeTruthy();
  });

  it("should render items", async () => {
    render(
      <HoverDropdown
        items={[{ key: "Item key", label: "Item label", value: "Item value" }]}
      >
        Children
      </HoverDropdown>,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText("Item label")).toBeTruthy();
  });
});
