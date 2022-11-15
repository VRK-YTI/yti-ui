import { render, screen } from "@testing-library/react";
import { themeProvider } from "@app/tests/test-utils";
import CheckboxFilter from "./checkbox-filter";

describe("checkboxFilter", () => {
  it("should render component", () => {
    render(
      <CheckboxFilter
        title="CheckboxFilter title"
        items={[
          { value: "item-1", label: "Item 1" },
          { value: "item-2", label: "Item 2" },
        ]}
        selectedItems={["item-1"]}
        checkboxVariant="small"
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText("CheckboxFilter title")).toBeInTheDocument();

    expect(screen.getByLabelText("Item 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Item 1")).toBeChecked();

    expect(screen.getByLabelText("Item 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Item 2")).not.toBeChecked();
  });
});
