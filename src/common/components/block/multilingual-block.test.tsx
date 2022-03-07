import { render, screen } from "@testing-library/react";
import { MultilingualBlock } from ".";
import { themeProvider } from "../../../tests/test-utils";

describe("MultilingualBlock", () => {
  test("should render items", () => {
    render(
      <MultilingualBlock<string>
        title="Title"
        data={["Item 1", "Item 2"]}
        mapper={(item) => ({ language: "", content: item })}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText(/Title/)).toBeInTheDocument;
    expect(screen.getByText(/Item 1/)).toBeInTheDocument;
    expect(screen.getByText(/Item 2/)).toBeInTheDocument;
  });
});
