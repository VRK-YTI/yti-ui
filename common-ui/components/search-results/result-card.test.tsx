import { themeProvider } from "../../utils/test-utils";
import { render, screen } from "@testing-library/react";
import ResultCard from "./result-card";

describe("result-card-expander", () => {
  it("should render component", () => {
    render(
      <ResultCard
        description="test description"
        title="title"
        titleLink=""
        type="type"
        contributors={['contributor-1']}
      />,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText("test description")).toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("type")).toBeInTheDocument();
    expect(screen.queryAllByText("contributor-1")).toHaveLength(2);
  });

  it("should render multiple contributors as amount", () => {
    render(
      <ResultCard
        description="test description"
        title="title"
        titleLink=""
        type="type"
        contributors={['contributor-1', 'contributor-2', 'contibutor-3']}
      />,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText("test description")).toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("type")).toBeInTheDocument();
    expect(screen.getByText("3 tr-card-organizations")).toBeInTheDocument();
    // These queried from <VisuallHidden> element
    expect(screen.getByText("contributor-1, contributor-2, contibutor-3")).toBeInTheDocument();
  });
});
